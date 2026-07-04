const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('../../src/Proxy/ObjectProxy', () => ({}));
jest.mock('../../src/Proxy/MethodProxy', () => ({ run: jest.fn() }));
jest.mock('../../src/Server/AIHelper', () => ({}));

const GitHubStorage = require('../../src/Persist/GitHubStorage');
const ClassProxy = require('../../src/Proxy/ClassProxy');

class SocialHandle {
    static definition = {
        name: 'SocialHandle',
        description: 'Social handle used by a person record.',
        methods: {},
        attributes: {
            stype: { type: 'string', description: 'Handle type' },
            name: { type: 'string', description: 'Handle value' },
        },
        associations: {},
        subClasses: [],
    };

    constructor(data = {}) {
        this.definition = this.constructor.definition;
        this._attributes = {};
        this._associations = {};
        Object.assign(this, data);
        if (data.stype !== undefined) this._attributes.stype = data.stype;
        if (data.name !== undefined) this._attributes.name = data.name;
    }
}

class Person {
    static definition = {
        name: 'Person',
        description: 'GuestManager-style person record.',
        unique: (obj) => obj.name,
        methods: {},
        attributes: {
            name: { type: 'string', description: 'Name of the person' },
            email: { type: 'string', description: 'Email address' },
            notes: { type: 'string', description: 'Notes about the person' },
            bio: { type: 'file', file: 'bio.md', description: 'Biography' },
            thumbnail: { type: 'file', encoding: 'base64', description: 'Thumbnail' },
            introVideo: { type: 'blob', storage: 's3', file: 'introVideo.mp4', encoding: 'base64', description: 'Introduction video' },
            audioBio: { type: 'file', storage: 's3', description: 'Audio biography' },
        },
        associations: {
            socials: {
                type: 'SocialHandle',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: 'owner',
            },
            episodes: {
                type: 'Episode',
                cardinality: 'n',
                composition: false,
                owner: false,
                via: 'guest',
                service: 'EpisodeService',
            },
        },
        subClasses: [],
    };

    constructor(data = {}) {
        this.definition = this.constructor.definition;
        this._attributes = {};
        this._associations = {};
        Object.assign(this, data);
        if (data.name !== undefined) this._attributes.name = data.name;
        if (data.email !== undefined) this._attributes.email = data.email;
        if (data.notes !== undefined) this._attributes.notes = data.notes;
    }
}

function makeTempDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'ailtire-persist-'));
}

describe('Persistence integration', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = makeTempDir();
        global._instances = {};
        global.classes = {
            Person,
            SocialHandle,
        };
        global.Person = Person;
        global.SocialHandle = SocialHandle;
        global.ailtire = {
            config: {
                persist: {
                    adaptor: null,
                },
            },
        };
    });

    afterEach(() => {
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        delete global.Person;
        delete global.SocialHandle;
        delete global.classes;
        delete global._instances;
        delete global.ailtire;
    });

    it('round-trips a GuestManager-style person through GitHubStorage', async () => {
        const storage = new GitHubStorage({
            localDir: tempDir,
            cloneDir: tempDir,
            externalDir: path.join(tempDir, 'external'),
            modelPaths: {
                Person: 'guests',
                SocialHandle: 'guests',
            },
            blobStorage: {
                default: 'external',
                fileDefault: 'github',
                useHeuristics: false,
                attributes: {
                    'Person.audioBio': 's3',
                },
            },
        });

        global.ailtire.config.persist.adaptor = storage;

        const s3Store = new Map();
        const stripS3Prefix = (fileName) => {
            if (typeof fileName !== 'string') {
                return fileName;
            }
            return fileName.startsWith('s3://') ? fileName.substring(5) : fileName;
        };
        const s3Stub = {
            name: 'MockS3',
            isHandled: (fileName) => typeof fileName === 'string' && fileName.startsWith('s3://'),
            save: async (itemDir, fileName, content, encoding) => {
                const actualFileName = stripS3Prefix(fileName);
                const value = encoding === 'base64'
                    ? Buffer.from(content, 'base64')
                    : content;
                s3Store.set(actualFileName, value);
                return `s3://${actualFileName}`;
            },
            load: async (itemDir, fileName, encoding) => {
                const actualFileName = stripS3Prefix(fileName);
                const value = s3Store.get(actualFileName);
                if (value === undefined || value === null) {
                    return null;
                }
                if (encoding === 'base64') {
                    return Buffer.isBuffer(value) ? value.toString('base64') : Buffer.from(String(value)).toString('base64');
                }
                return Buffer.isBuffer(value) ? value.toString(encoding || 'utf-8') : String(value);
            },
        };
        storage.registerProvider('s3', s3Stub);
        storage.s3Provider = s3Stub;
        storage.addProvider(s3Stub);

        const person = new Person({ name: 'Ada Lovelace', email: 'ada@example.com', notes: 'Foundational guest' });
        person.bio = 'Bio text';
        person.thumbnail = Buffer.from('thumbnail-bytes').toString('base64');
        person.introVideo = Buffer.from('intro-video-bytes').toString('base64');
        person.audioBio = 'audio-bytes';
        person._attributes.bio = 'Bio text';
        person._attributes._bio_file = 'bio.md';
        person._attributes.thumbnail = Buffer.from('thumbnail-bytes').toString('base64');
        person._attributes._thumbnail_file = 'thumbnail.png';
        person._attributes.introVideo = Buffer.from('intro-video-bytes').toString('base64');
        person._attributes._introVideo_file = 'introVideo.mp4';
        person._attributes.audioBio = 'audio-bytes';
        person._attributes._audioBio_file = 'audioBio.mp3';
        person.socials = [new SocialHandle({ stype: 'x', name: '@ada' })];
        person.episodes = [{ id: 'episode-1', name: 'Pilot' }];

        await storage.save(person, 'guests');

        const indexPath = path.join(tempDir, 'guests', 'Ada-Lovelace', 'index.js');
        expect(fs.existsSync(indexPath)).toBe(true);
        const saved = require(indexPath);
        expect(saved.name).toBe('Ada Lovelace');
        expect(saved.bio).toBe('bio.md');
        expect(saved.thumbnail).toBe('thumbnail.png');
        expect(saved.introVideo).toBe('s3://introVideo.mp4');
        expect(saved.audioBio).toBe('s3://audioBio.mp3');
        expect(saved.socials[0].name).toBe('@ada');
        expect(saved.episodes.query).toBe('?guest=Ada Lovelace');
        expect(saved.episodes.type).toBe('Episode');
        expect(saved.episodes.service).toBe('EpisodeService');

        const loadedMap = await storage.loadAll(Person);
        expect(Array.isArray(loadedMap)).toBe(true);
        expect(loadedMap).toHaveLength(1);

        const reloaded = loadedMap[0];
        expect(reloaded.name).toBe('Ada Lovelace');
        expect(reloaded.email).toBe('ada@example.com');
        expect(reloaded.socials).toHaveLength(1);
        expect(reloaded.socials[0].name).toBe('@ada');
        expect(reloaded.episodes).toBeUndefined();
        expect(reloaded._attributes._bio_file).toBe('bio.md');
        expect(await storage.loadAttribute(reloaded, 'bio')).toBe('Bio text');
        expect(await storage.loadAttribute(reloaded, 'thumbnail')).toBe(Buffer.from('thumbnail-bytes').toString('base64'));
        expect(await storage.loadAttribute(reloaded, 'audioBio')).toBe('audio-bytes');
    });

    it('routes class-level load through the adaptor when the model does not override it', async () => {
        const adaptor = {
            loadClass: jest.fn(async (cls, subDir) => {
                return { cls, subDir, status: 'loaded' };
            }),
        };
        global.ailtire.config.persist.adaptor = adaptor;

        class ModelWithoutLoad {
            static definition = {
                name: 'ModelWithoutLoad',
                description: 'Model without a custom load method.',
                methods: {},
                attributes: {},
                associations: {},
                subClasses: [],
            };
        }

        const proxied = new Proxy(ModelWithoutLoad, ClassProxy);
        const result = await proxied.load('guests');

        expect(adaptor.loadClass).toHaveBeenCalledTimes(1);
        expect(adaptor.loadClass.mock.calls[0][0]).toBe(ModelWithoutLoad);
        expect(adaptor.loadClass.mock.calls[0][1]).toBe('guests');
        expect(result.status).toBe('loaded');
    });
});
