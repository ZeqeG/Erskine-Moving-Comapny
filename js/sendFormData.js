window.addEventListener("load", function () {
    const form = document.getElementById('servicesSection4');
    const submitBtn = document.getElementById('submitBtn');
    form.addEventListener("submit", function (e) {
        if (submitBtn) {
            submitBtn.value = 'Loading...'; // Use only textContent
        }
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