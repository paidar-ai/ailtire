---
layout: default
title: Persistence
permalink: persistence
has_children: false
---
# Persistence

ailtire now routes persistence through `config.persist.adaptor` when a model does not override `save()` or `load()`.
The framework also awaits `persist.adaptor.loadAll()` during startup so repo-backed loaders can finish before the
application starts serving requests.

## Object Persistence

Use the adaptor for the model graph itself:

```js
const storage = new GitHubStorage({
  repo: 'owner/repo',
  localDir: './.ailtire',
  cloneDir: './.ailtire/repo',
  modelPaths: {
    Person: 'guests'
  }
});

server.listen({
  persist: {
    adaptor: storage
  }
});
```

The generic proxy flow is:

1. `ObjectProxy.save()` falls back to the adaptor when the model does not implement `save()`.
2. `ObjectProxy.load()` falls back to the adaptor when the model does not implement `load()`.
3. `ClassProxy.load()` now also falls back to the adaptor for class-level loads.

## Blob Routing

`GitHubStorage` treats file/blob attributes separately from the object graph. Route them with `blobStorage`:

```js
const storage = new GitHubStorage({
  localDir: './.ailtire',
  blobStorage: {
    default: 'external',
    fileDefault: 'github',
    useHeuristics: false,
    attributes: {
      'Person.avatar': 'azure',
      'Person.bio': 'github'
    }
  },
  azure: {
    connectionString: '...',
    containerName: 'person-assets'
  }
});
```

Resolution order is:

1. attribute-level `storageProvider`, `provider`, or `storage`
2. `blobStorage.attributes['Model.attribute']`
3. `blobStorage.attributes['attribute']`
4. `blobStorage.default` for blob fields
5. `blobStorage.fileDefault` for file fields
6. heuristics only if `useHeuristics` is not disabled

The supported provider names are:

- `github`
- `external`
- `azure`
- `s3`
- `minio`
- `cloudflare`

Owned compositions are saved and loaded as part of the object tree. Owned non-compositions are stored in child
directories. Non-owned associations remain references.
