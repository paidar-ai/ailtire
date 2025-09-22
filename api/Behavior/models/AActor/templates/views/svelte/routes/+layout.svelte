<style>
    /* Header container using CSS Grid */
    .header {
        display: grid;
        grid-template-columns: auto 1fr 1fr; /* Menu area auto-sized, middle spacer, and right area flexed */
        grid-template-areas: 
            "menu spacer right"; /* Named zones for content */
        align-items: center; /* Vertically center content */
        height: 50px; /* Fixed header height */
        width: 100%; /* Full width */
        position: fixed; /* Keep header fixed at the top */
        top: 0;
        left: 0;
        background-color: #456789; /* Background color */
        color: white; /* Header text color */
        padding: 0 20px; /* Add some inner padding */
        z-index: 1000; /* Ensure it appears above other elements */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Shadow effect */
        font-family: Arial, sans-serif; /* Consistent font */
    }

    /* Menu Section Styles */
    .header-menu {
        grid-area: menu; /* Align to the grid 'menu' area */
        display: flex; /* Use Flexbox for menu items */
        gap: 2rem; /* Create more space between menu items */
        flex-shrink: 0; /* Do not shrink the menu area */
    }

    /* Individual menu item styles */
    .menu-item {
        text-decoration: none; /* Remove links underline effect */
        color: white; /* White text color for visibility */
        font-weight: 500; /* Slightly bold menu text */
        transition: color 0.3s ease; /* Smooth hover effect */
    }

    .menu-item:hover {
        color: #ffcc00; /* Highlight menu item on hover */
    }

    /* Title Section Styles */
    .header-title {
        grid-area: right; /* Align to the grid 'right' area */
        text-align: right; /* Align content to the right */
        font-size: 1.2rem; /* Larger font size for title */
        font-weight: bold; 
        /* Ensure title does not break or overflow */
        white-space: nowrap; /* Don't allow the title to span multiple lines */
        overflow: hidden; /* Clip content if it overflows */
        text-overflow: ellipsis; /* Add ellipsis when content is clipped */
    }

    /* Dynamic Spacer Styles */
    .header-spacer {
        grid-area: spacer; /* This section flexibly uses remaining space */
    }

    /* Main content styling */
    .main-content {
        flex-grow: 1;
        background: #123456;
        overflow: auto; /* Enable scrolling */
        padding: 50px 0px 40px; /* Allow for fixed header/footer */
    }

    /* Footer Styles */
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%; /* Full width */
        background-color: #456789; /* Match the header's background */
        color: white; /* Footer text color */
        text-align: center; /* Center-align text */
        height: 40px; /* Fixed footer height */
        line-height: 40px; /* Vertically align text */
        z-index: 1000; /* Stay above content */
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2); /* Shadow effect */
    }
</style>

<div class="flex flex-col h-screen w-full">
    <!-- HEADER -->
    <header class="header">
        <!-- Menu Section -->
        <div class="header-menu">
            <a href="/" class="menu-item">Home</a>
            <a href="/actors/architect" class="menu-item">Architect</a>
        </div>

        <!-- Spacer -->
        <div class="header-spacer"></div>

        <!-- Title Section -->
        <div class="header-title">
            Runaire
        </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="main-content">
        <slot />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
        System Status: <strong>Online</strong>
    </footer>
</div>