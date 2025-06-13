window.addEventListener("load", function () {
    const form = document.getElementById('servicesSection4');
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(form);
        const action = e.target.action;
        fetch(action, {
            method: 'POST',
            body: data,
        })
            .then(() => {
                window.location.href = 'quoteMap.html';
            })
    });
});