app.controller(
    "PatientDashboardController",
    function ($scope, $location, $http) {
        console.log(localStorage.getItem("userId"));
    }
);
app.controller(
    "PatientMyAppointmentController",
    function ($scope, $location, $http) {
        console.log(localStorage.getItem("userId"));
    }
);
app.controller(
    "PatientFindAppointmentController",
    function ($scope, $location, $http) {
        $scope.date;
        $scope.startTime;
        $scope.endTime;
        $scope.doctor = "0";
        $scope.doctors = [];
        $scope.status = -1;
        $scope.message = "";
        console.log(localStorage.getItem("userId"));
        $http
            .get("http://localhost:3000/patient/findDoctors")
            .then(function (response) {
                $scope.doctors = response.data;
                // Ad
                // Success callback
                // console.log(response.data); // Optionally, update UI or show success message
            })
            .catch(function (error) {
                // Error callback
                console.error("Error making POST request:", error);
                // Optionally, display error message to user
            });
        $scope.searchAppointment = function () {
            var requestData = {
                // Define your request data here
                doctor: $scope.doctor,
                patient: localStorage.getItem("userId"),
                date: $scope.date,
                startTime: $scope.startTime,
                endTime: $scope.endTime,
            };

            $http
                .post(
                    "http://localhost:3000/patient/findAppointments",
                    requestData
                )
                .then(function (response) {
                    // Success callback
                    console.log(response);
                    $scope.status = response.data.status;
                    $scope.message = response.data.message;

                    // Optionally, update UI or show success message
                })
                .catch(function (error) {
                    // Error callback
                    console.error("Error making POST request:", error);
                    // Optionally, display error message to user
                });
            // You can perform additional actions like sending data to a server
        };
        $scope.bookNow = function () {
            var requestData = {
                // Define your request data here
                doctor: $scope.doctor,
                patient: localStorage.getItem("userId"),
                date: $scope.date,
                startTime: $scope.startTime,
                endTime: $scope.endTime,
            };
            $http
                .post(
                    "http://localhost:3000/patient/bookAppointment",
                    requestData
                )
                .then(function (response) {
                    console.log(response);
                    $scope.status = response.data.status;
                    $scope.message = response.data.message;
                    if (response.data.status == 0) {
                        Swal.fire({
                            title: "Booked",
                            text: $scope.message,
                            icon: "success",
                        });
                    } else {
                        Swal.fire({
                            title: "Not Booked!",
                            text: $scope.message,
                            icon: "error",
                        });
                    }
                })
                .catch(function (error) {
                    // Error callback
                    console.error("Error making POST request:", error);
                    // Optionally, display error message to user
                });
        };
    }
);
app.controller("PatientDoctorController", function ($scope, $location, $http) {
    $scope.doctors = [
        {},
        // Add more objects as needed
    ];
    $http
        .get("http://localhost:3000/patient/findDoctors")
        .then(function (response) {
            $scope.doctors = response.data;
            // Ad
            // Success callback
            // console.log(response.data); // Optionally, update UI or show success message
        })
        .catch(function (error) {
            // Error callback
            console.error("Error making POST request:", error);
            // Optionally, display error message to user
        });
    $scope.sortColumn = "";
    $scope.sortReverse = false;

    $scope.sortBy = function (column) {
        if ($scope.sortColumn === column) {
            $scope.sortReverse = !$scope.sortReverse; // Toggle sort order
        } else {
            $scope.sortColumn = column;
            $scope.sortReverse = false; // Default to ascending order when changing column
        }
    };
    // You can perform additional actions like sending data to a server
});
