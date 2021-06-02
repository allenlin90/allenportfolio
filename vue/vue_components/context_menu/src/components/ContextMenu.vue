<template>
    <transition>
        <div
            id="context_menu"
            @contextmenu.capture.prevent
            ref="contextMenu"
            v-click-outside="closeMenu"
            v-show="isMenuOpened"
        >
            <div class="item"><i class="fas fa-cut"></i> <span>Cut</span></div>
            <div class="item">
                <i class="fa fa-clone"></i> <span>Copy</span>
            </div>
            <div class="item">
                <i class="fa fa-paste"></i> <span>Paste</span>
            </div>
            <div class="item">
                <i class="fas fa-trash"></i> <span>Delete</span>
            </div>
            <hr />
            <div class="selector">
                <label for="select_group">Select Group</label>
                <select id="select_group">
                    <option v-for="item in list" :key="item" :value="item">
                        {{ item }}
                    </option>
                </select>
            </div>
            <div class="item">
                <i class="fas fa-sync-alt"></i><span>Refresh</span>
            </div>
            <div class="item">
                <i class="fas fa-times"></i><span>Exit</span>
            </div>
        </div>
    </transition>
</template>

<script>
import ClickOutside from "../assets/vue-click-outside.js";

export default {
    props: {
        list: {
            type: Array,
            default() {
                return [1, 2];
            },
            required: false,
        },
    },
    data() {
        return {
            isMenuOpened: false,
        };
    },
    directives: {
        ClickOutside,
    },
    methods: {
        openMenu(event) {
            this.isMenuOpened = true;
            console.log("right click");
            const contextMenu = this.$refs.contextMenu;
            contextMenu.style.top = event.clientY + "px";
            contextMenu.style.left = event.clientX + "px";
        },
        closeMenu() {
            this.isMenuOpened = false;
        },
    },
};
</script>

<style scoped lang="scss">
$menu-background-color: #555;
$menu-text-color: #fff;

#context_menu {
    position: fixed;
    z-index: 10000;

    min-width: 180px;
    width: max-content;
    color: $menu-text-color;
    background-color: $menu-background-color;
    font-size: 1.2rem;
    border-radius: 5px;

    .item {
        padding: 0.3rem 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        &:first-child {
            border-radius: 5px 5px 0 0;
        }
        &:last-child {
            border-radius: 0 0 5px 5px;
        }

        span {
            display: inline-block;
            margin-left: 10px;
        }
    }

    .item:hover {
        color: invert($menu-text-color);
        background-color: invert($menu-background-color);
    }

    .selector {
        display: flex;
        flex-direction: column;
        padding: 0.3rem 1rem;
    }

    hr {
        margin: 0;
    }
}

.v-enter-active {
    animation: fadeIn 0.2s ease;
}

.v-leave-active {
    animation: fadeIn 0.2s ease reverse;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>