<template>
    <div class="box">
        <header class="header">Vue Context Menu</header>
        <div @contextmenu.prevent="$refs.menu.openMenu($event, 'payload')">
            <teleport to="body">
                <context-menu ref="menu"></context-menu>
            </teleport>
        </div>
        <footer class="footer">MAKESEND &copy; 2021</footer>
    </div>
</template>

<script>
import ContextMenu from "./components/ContextMenu.vue";
export default {
    components: {
        ContextMenu,
    },
    date() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss">
$theme-color: #ffc107;
$color-dark-grey-1: #777;

.box {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > div {
        width: 100%;
        flex-grow: 1;
        padding: 1rem;
        background-color: $color-dark-grey-1;
        margin: 0;
    }

    .header {
        background-color: $theme-color;
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        padding: 0.5rem;
        text-transform: uppercase;
    }

    .footer {
        background-color: $theme-color;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        padding: 0.5rem;
        text-transform: uppercase;
    }
}
</style>
