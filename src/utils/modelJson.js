const fs = require('fs');
const path = require('path');

function resolveClass(type) {
  return global[type] || (global.classes ? global.classes[type] : null);
}

function getId(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== 'object') {
    return value;
  }
  if (value.id) {
    return value.id;
  }
  if (value._attributes && value._attributes.id) {
    return value._attributes.id;
  }
  if (value.name) {
    return value.name;
  }
  if (value._attributes && value._attributes.name) {
    return value._attributes.name;
  }
  return null;
}

function isMany(assocDef) {
  return assocDef.cardinality === 'n' || assocDef.cardinality === 'N' || assocDef.cardinality > 1;
}

function serializeModel(obj, seen = new WeakSet()) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (seen.has(obj)) {
    return getId(obj);
  }
  seen.add(obj);

  const json = {};
  for (const name in obj._attributes) {
    if (name[0] !== '_') {
      json[name] = obj._attributes[name];
    }
  }

  const associations = obj.definition?.associations || {};
  for (const name in associations) {
    const assocDef = associations[name];
    const assocVal = obj._associations ? obj._associations[name] : undefined;

    if (!isMany(assocDef)) {
      if (!assocVal) {
        json[name] = null;
      } else if (assocDef.composition) {
        json[name] = serializeModel(assocVal, seen);
      } else {
        json[name] = getId(assocVal);
      }
    } else {
      const items = [];
      if (assocVal) {
        if (Array.isArray(assocVal)) {
          for (const item of assocVal) {
            if (assocDef.composition) {
              items.push(serializeModel(item, seen));
            } else {
              items.push(getId(item));
            }
          }
        } else {
          for (const key in assocVal) {
            const item = assocVal[key];
            if (assocDef.composition) {
              items.push(serializeModel(item, seen));
            } else {
              items.push(getId(item));
            }
          }
        }
      }
      json[name] = items;
    }
  }

  return json;
}

function tryFindAssociation(assocDef, assocId) {
  if (!assocId) {
    return null;
  }
  const assocClass = resolveClass(assocDef.type);
  if (!assocClass || typeof assocClass.find !== 'function') {
    return null;
  }
  return assocClass.find({ id: assocId }) || assocClass.find({ name: assocId }) || assocClass.find(assocId);
}

function tryLoadAssociation(assocDef, assocId) {
  if (!assocId) {
    return null;
  }
  const assocClass = resolveClass(assocDef.type);
  if (!assocClass || typeof assocClass.load !== 'function') {
    return null;
  }
  const baseDir = global.ailtire?.config?.baseDir || '.';
  const filePath = path.resolve(baseDir, `.ailtire/${assocDef.type}/${assocId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return assocClass.load({ fileName: filePath });
}

function deserializeModel(cls, json) {
  if (!json || typeof json !== 'object') {
    return null;
  }
  const attributes = cls.definition?.attributes || {};
  const associations = cls.definition?.associations || {};

  const attrs = {};
  if (json.id) {
    attrs.id = json.id;
  }
  for (const name in attributes) {
    if (json.hasOwnProperty(name)) {
      attrs[name] = json[name];
    }
  }

  const obj = new cls(attrs);

  for (const name in associations) {
    if (!json.hasOwnProperty(name)) {
      continue;
    }
    const assocDef = associations[name];
    const assocVal = json[name];

    if (!isMany(assocDef)) {
      if (assocDef.composition) {
        if (assocVal) {
          const assocClass = resolveClass(assocDef.type);
          if (assocClass) {
            const child = deserializeModel(assocClass, assocVal);
            obj[name] = child;
          }
        } else {
          obj[name] = null;
        }
      } else {
        const assocId = getId(assocVal);
        let found = tryFindAssociation(assocDef, assocId) || tryLoadAssociation(assocDef, assocId);
        if (found) {
          obj[name] = found;
        } else {
          if (!obj._associations) {
            obj._associations = {};
          }
          obj._associations[name] = assocId;
        }
      }
    } else {
      if (assocDef.composition) {
        const children = [];
        const values = Array.isArray(assocVal) ? assocVal : Object.values(assocVal || {});
        const assocClass = resolveClass(assocDef.type);
        if (assocClass) {
          for (const item of values) {
            const child = deserializeModel(assocClass, item);
            if (child) {
              children.push(child);
            }
          }
        }
        obj[name] = children;
      } else {
        const ids = Array.isArray(assocVal) ? assocVal : Object.values(assocVal || {});
        const resolved = [];
        for (const item of ids) {
          const assocId = getId(item);
          let found = tryFindAssociation(assocDef, assocId) || tryLoadAssociation(assocDef, assocId);
          resolved.push(found || assocId);
        }
        if (!obj._associations) {
          obj._associations = {};
        }
        obj._associations[name] = resolved;
      }
    }
  }

  return obj;
}

module.exports = {
  serializeModel,
  deserializeModel,
};
