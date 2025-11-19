import restAdapter from './restAdapter';
import mcpAdapter  from './mcpAdapter';

let adapter = process.env.ADAPTER === 'mcp' ? mcpAdapter : restAdapter;

export function api() {
    return adapter;
}