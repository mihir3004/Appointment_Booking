app.controller(
    "DoctorDashboardController",
    function ($scope, $location, $http) {
        window.location.href = "#!/doctor/appointment";
    }
);
app.controller(
    "DoctorAppointmentController",
    function ($scope, $location, $http) {
        console.log("hii");
        $scope.appointments = [
            {},
            // Add more objects as needed
        ];
        var requestData = {
            // Define your request data here
            doctor: localStorage.getItem("userId"),
            date: Date.now(),
        };
        // console.log("jnkj");
        $http
            .post(
                "http://localhost:3000/doctor/findMyAppointments",
                requestData
            )
            .then(function (response) {
                console.log(response.data);
                $scope.appointments = response.data;
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
        $scope.approve = function (e) {
            let id = { id: e._id };
            $http
                .post("http://localhost:3000/doctor/approveAppointment", id)
                .then(function (response) {
                    Swal.fire({
                        title: "Approved!",
                        text: "Appointment has been approved.",
                        icon: "success",
                    });
                    var requestData = {
                        // Define your request data here
                        doctor: localStorage.getItem("userId"),
                        date: Date.now(),
                    };
                    // console.log("jnkj");
                    $http
                        .post(
                            "http://localhost:3000/doctor/findMyAppointments",
                            requestData
                        )
                        .then(function (response) {
                            console.log(response.data);
                            $scope.appointments = response.data;
                            // Ad
                            // Success callback
                            // console.log(response.data); // Optionally, update UI or show success message
                        })
                        .catch(function (error) {
                            // Error callback
                            console.error("Error making POST request:", error);
                            // Optionally, display error message to user
                        });
                    // Ad
                    // Success callback
                    // console.log(response.data); // Optionally, update UI or show success message
                })
                .catch(function (error) {
                    // Error callback
                    console.error("Error making POST request:", error);
                    // Optionally, display error message to user
                });
        };
        $scope.reject = function (e) {
            console.log(e._id);

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    let id = { id: e._id };
                    $http
                        .post(
                            "http://localhost:3000/doctor/deleteAppointment",
                            id
                        )
                        .then(function (response) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Appointment has been rejeted.",
                                icon: "success",
                            });
                            var requestData = {
                                // Define your request data here
                                doctor: localStorage.getItem("userId"),
                                date: Date.now(),
                            };
                            // console.log("jnkj");
                            $http
                                .post(
                                    "http://localhost:3000/doctor/findMyAppointments",
                                    requestData
                                )
                                .then(function (response) {
                                    console.log(response.data);
                                    $scope.appointments = response.data;
                                    // Ad
                                    // Success callback
                                    // console.log(response.data); // Optionally, update UI or show success message
                                })
                                .catch(function (error) {
                                    // Error callback
                                    console.error(
                                        "Error making POST request:",
                                        error
                                    );
                                    // Optionally, display error message to user
                                });
                            // Ad
                            // Success callback
                            // console.log(response.data); // Optionally, update UI or show success message
                        })
                        .catch(function (error) {
                            // Error callback
                            console.error("Error making POST request:", error);
                            // Optionally, display error message to user
                        });
                }
            });
        };
    }
);
app.controller(
    "DoctorPatientController",
    function ($scope, $location, $http) {}
);
