document.addEventListener('DOMContentLoaded', function() {
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    const form = document.querySelector('.booking-form');
    const email = document.querySelector('input[name="bookingEmail"]');
    const retypeEmail = document.querySelector('input[name="retypeEmail"]');

    if (bookingDetails) {
        updateHiddenField('tourTitle', bookingDetails.tourTitle);
        updateHiddenField('tourURL', bookingDetails.tourURL);
        updateHiddenField('country', bookingDetails.country);
        updateHiddenField('location', bookingDetails.location);
        updateHiddenField('adultCount', bookingDetails.count0);
        updateHiddenField('youthCount', bookingDetails.count1);
        updateHiddenField('childCount', bookingDetails.count2);
        updateHiddenField('totalPrice', bookingDetails.totalPrice);
        updateHiddenField('duration', bookingDetails.duration);
        updateHiddenField('totalGuests', bookingDetails.totalGuests);
        updateHiddenField('bookingDate', bookingDetails.date);

        const currencySymbol = bookingDetails.country && bookingDetails.country.toLowerCase() === 'kenya' ? 'KES' : 'USD';

        document.getElementById('tourImage').src = bookingDetails.image;
        document.getElementById('tourImage').alt = bookingDetails.alt;
        document.getElementById('tourTitleLink').textContent = bookingDetails.tourTitle;
        document.getElementById('destination').textContent = bookingDetails.location;
        document.getElementById('totalGuests').textContent = `${bookingDetails.totalGuests} Guests`;
        document.getElementById('duration').textContent = `${bookingDetails.duration} Days`;

        document.getElementById('adultPrice').textContent = `${currencySymbol} ${bookingDetails.adultPrice} x ${bookingDetails.count0} tickets = ${currencySymbol} ${(bookingDetails.adultPrice * bookingDetails.count0).toFixed(2)}`;
        document.getElementById('youthPrice').textContent = `${currencySymbol} ${bookingDetails.youthPrice} x ${bookingDetails.count1} tickets = ${currencySymbol} ${(bookingDetails.youthPrice * bookingDetails.count1).toFixed(2)}`;
        document.getElementById('childPrice').textContent = `${currencySymbol} ${bookingDetails.childPrice} x ${bookingDetails.count2} tickets = ${currencySymbol} ${(bookingDetails.childPrice * bookingDetails.count2).toFixed(2)}`;

        document.getElementById('totalPrice').textContent = `${currencySymbol} ${bookingDetails.totalPrice.toFixed(2)}`;

        if (bookingDetails.date) {
            const dateElement = document.createElement('span');
            dateElement.innerHTML = `<i class="far fa-calendar-alt"></i> ${bookingDetails.date}`;
            document.querySelector('.meta').appendChild(dateElement);
        }
    } else {
        console.error("No booking details found in local storage.");
    }

    function updateHiddenField(name, value) {
        let hiddenInput = document.querySelector(`input[name="${name}"]`);
        if (hiddenInput) {
            hiddenInput.value = value;
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (email.value.trim().toLowerCase() !== retypeEmail.value.trim().toLowerCase()) {
            alert("Emails do not match!");
            return;
        }
        form.submit();
    });
});
