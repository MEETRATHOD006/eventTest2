document.addEventListener('DOMContentLoaded', function() {
    // Array to store registration data
    var registrations = [];

    // Function to check if enrollment number already exists
    function isDuplicateEnrollment(enrollmentNumber) {
        return registrations.some(function(registration) {
            return registration.enrollmentNumber === enrollmentNumber;
    });
}

    // Function to check if phone number already exists
    function isDuplicatePhoneNumber(phoneNumber) {
        return registrations.some(function(registration) {
            return registration.phoneNumber === phoneNumber;
    });
}
    // Default member IDs and passwords
    var members = [
        { id: "meet19", password: "19012006" },
        { id: "kartik00", password: "21052006" },
        { id: "dhruv11", password: "40201005" }
    ];

    // Load registrations from localStorage on page load
    loadRegistrations();

    // Function to handle form submission
    document.getElementById("registerBtn").addEventListener("click", function() {
        var enrollmentNumber = document.getElementById("enrollmentNumber").value.trim();
        var name = document.getElementById("name").value.trim();
        var phoneNumber = document.getElementById("phoneNumber").value.trim();
        var alooPuriQuantity = parseInt(document.getElementById("AlooPuriQuantity").value);
        var thumsUpQuantity = parseInt(document.getElementById("ThumsUpQuantity").value);
        var vadaPavQuantity = parseInt(document.getElementById("VadaPavQuantity").value);
        var burgerQuantity = parseInt(document.getElementById("burgerQuantity").value);
        
        // Validate inputs
        if (!validateInputs(enrollmentNumber, name, phoneNumber)) {
            alert("Please fill in all details correctly.");
            return;
        }

        // Validate enrollment number range
        if (!validateEnrollmentNumber(enrollmentNumber)) {
            alert("Enrollment number should be between 226120316001 and 226120316079.");
            return;
        }

        // Validate phone number format
        if (!validatePhoneNumber(phoneNumber)) {
            alert("Phone number should be a 10-digit number.");
            return;
        }

        // Check if enrollment number already exists
        if (isDuplicateEnrollment(enrollmentNumber)) {
            alert("Enrollment number already exists. Please enter a different enrollment number.");
            return;
        }

        // Check for duplicate phone number
        if (isDuplicatePhoneNumber(phoneNumber)) {
            alert("Phone number already exists. Please enter a different phone number.");
            return;
        }

        // Calculate total amount
        var alooPuriPrice = 20;
        var thumsUpPrice = 40;
        var vadaPavPrice = 15;
        var burgerPrice = 50;
        var totalAmount = (alooPuriPrice * alooPuriQuantity) + (thumsUpPrice * thumsUpQuantity) + (vadaPavPrice * vadaPavQuantity) + (burgerPrice * burgerQuantity);

        // Automatically confirm registration if no food is chosen
        var status = totalAmount > 0 ? "Pending" : "Confirmed";

        // Display QR code and message
        document.getElementById("qrCode").style.display = "block";
        document.getElementById("qrCode").innerHTML = "<p>Total Amount: ₹" + totalAmount + "</p><p>If you pay the amount, your registration will be confirmed within a few hours.</p>"+"<img src='https://eko.in/assets/img/bill-payment/QR.png' alt='QR Code'>";

        // Add registration data to array
        var registration = {
            enrollmentNumber: enrollmentNumber,
            name: name,
            phoneNumber: phoneNumber,
            totalAmount: totalAmount,
            status: status
        };
        registrations.push(registration);

        // Save registrations to localStorage
        saveRegistrations();

        // Update table
        updateTable();

        if (totalAmount > 0) {
            document.getElementById("qrCode").style.display = "block";
        } else {
            document.getElementById("qrCode").style.display = "none";
        }
    });

    // Function to update table with registration data
    function updateTable() {
        var tableBody = document.querySelector("#registrationTable tbody");
        tableBody.innerHTML = "";
        registrations.forEach(function(registration, index) {
            var row = "<tr>";
            row += "<td>" + registration.enrollmentNumber + "</td>";
            row += "<td>" + registration.name + "</td>";
            row += "<td>" + registration.phoneNumber + "</td>";
            row += "<td>₹" + registration.totalAmount + "</td>";
            row += "<td>" + registration.status + "</td>";
            if (memberLoggedIn) {
                row += "<td><button class='removeBtn' data-index='" + index + "'>Remove</button></td>";
                if (registration.status === "Pending") {
                    row += "<td><button class='confirmBtn' data-index='" + index + "'>Confirm</button></td>";
                } else {
                    row += "<td></td>";
                }
            }
            row += "</tr>";
            tableBody.innerHTML += row;
        });

        // Add event listeners for remove and confirm buttons
        var removeButtons = document.querySelectorAll(".removeBtn");
        removeButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                var index = parseInt(button.getAttribute("data-index"));
                registrations.splice(index, 1);
                saveRegistrations();
                updateTable();
            });
        });

        var confirmButtons = document.querySelectorAll(".confirmBtn");
        confirmButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                var index = parseInt(button.getAttribute("data-index"));
                registrations[index].status = "Confirmed";
                saveRegistrations();
                updateTable();
            });
        });
    }

    // Function to handle member login
    document.getElementById("memberLoginBtn").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent form submission

        var memberId = document.getElementById("memberId").value.trim();
        var password = document.getElementById("password").value.trim();
        
        // Check if provided credentials match any member
        var member = members.find(function(member) {
            return member.id === memberId && member.password === password;
        });

        // If member found, enable member-related options
        if (member) {
            memberLoggedIn = true;
            // Show buttons for removing and confirming registrations
            updateTable();
            // Close the login popup
            document.getElementById("memberLoginPopup").style.display = "none";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });

    // Function to save registrations to localStorage
    function saveRegistrations() {
        localStorage.setItem('registrations', JSON.stringify(registrations));
    }

    // Function to load registrations from localStorage
    function loadRegistrations() {
        var storedRegistrations = localStorage.getItem('registrations');
        if (storedRegistrations) {
            registrations = JSON.parse(storedRegistrations);
            updateTable();
        }
    }

    // Function to validate input fields
    function validateInputs(enrollmentNumber, name, phoneNumber) {
        return enrollmentNumber !== '' && name !== '' && phoneNumber !== '';
    }

    // Function to validate enrollment number range
    function validateEnrollmentNumber(enrollmentNumber) {
        var enrollmentNumberInt = parseInt(enrollmentNumber);
        return enrollmentNumberInt >= 226120316001 && enrollmentNumberInt <= 226120316079;
    }

    // Function to validate phone number format
    function validatePhoneNumber(phoneNumber) {
        return /^\d{10}$/.test(phoneNumber);
    }

    // Variable to track member login status
    var memberLoggedIn = false;

    // Get the member login popup
    var memberLoginPopup = document.getElementById("memberLoginPopup");

    // Get the button that opens the member login popup
    var memberLoginTrigger = document.getElementById("memberLoginTrigger");

    // Get the <span> element
    var closeMemberLogin = document.getElementById("closeMemberLogin");

// When the user clicks on the button, open the member login popup
memberLoginTrigger.onclick = function() {
    memberLoginPopup.style.display = "block";
}

// When the user clicks on <span> element that closes the member login popup, close it
closeMemberLogin.onclick = function() {
    memberLoginPopup.style.display = "none";
}

// When the user clicks anywhere outside of the member login popup, close it
window.onclick = function(event) {
    if (event.target == memberLoginPopup) {
        memberLoginPopup.style.display = "none";
    }
}
});
