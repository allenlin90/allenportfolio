const app = Vue.createApp({
    date() {
        return {
            show: false,
        };
    }
});

app.component(`context-menu`, {
    template: `
    <div class="context_menu">
        <ul>
            <li><i class="fas fa-cut"></i></li>
            <li>
                <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </li>
        </ul>
    <div>
    `,
    date() { return {} },
})

app.mount('#app')