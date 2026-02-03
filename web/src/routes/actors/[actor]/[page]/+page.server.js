export function load({ params }) {

    // Example: Pass data to the +page.svelte component
    return {
        actor: params.actor,
        page: params.page
    };
}
