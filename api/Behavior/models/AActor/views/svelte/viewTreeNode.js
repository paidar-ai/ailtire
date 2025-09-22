export function createTreeNode(element) {
    return `@startuml\nactor ${element.id} {\n}\n@enduml`;
}