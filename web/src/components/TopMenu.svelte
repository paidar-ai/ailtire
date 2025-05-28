<script>
    import TopMenu from './TopMenu.svelte';
    import Menu from "./Menu.svelte";

    const menuItems = [
        { label: 'Home', link: '/' },
        { label: 'About', link: '/about' },
        { label: 'Contact', link: '/contact' },
    ];

    function handleMenuClick(item) {
        // Handle menu click logic, e.g., navigation
        console.log('Selected Menu Item:', item);
    }
</script>

<div id="top-menu">
    <Menu {menuItems} {handleMenuClick} ></Menu>
</div>