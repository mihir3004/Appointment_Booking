app.controller("LoginController", function ($scope, $location, $http) {
    $scope.username = "";
    $scope.password = "";
    $scope.role = "0";
    $scope.submitForm = function () {
        // Here you can access form data using $scope.formData
        console.log("Form submitted with data:", $scope);
        var requestData = {
            // Define your request data here
            username: $scope.username,
            password: $scope.password,
            role: $scope.role,
        };

        $http
            .post("http://localhost:3000/login", requestData)
            .then(function (response) {
                // Success callback
                console.log(response);
                if (response.data.user == null) {
                    $scope.error = "Invalid Credentials";
                } else {
                    localStorage.setItem("userId", response.data.user._id);
                    localStorage.setItem("role", response.data.user.role);
                    $location.path(localStorage.getItem("role").toLowerCase());
                }
                // Optionally, update UI or show success message
            })
            .catch(function (error) {
                // Error callback
                console.error("Error making POST request:", error);
                // Optionally, display error message to user
            });
        // You can perform additional actions like sending data to a server
    };
});
app.controller("RegisterController", function ($scope, $location, $http) {
    $scope.username = "";
    $scope.password = "";
    $scope.role = "0";
    $scope.email = "";
    $scope.phone = "";
    $scope.education = "";
    $scope.speciality = "";
    $scope.startTime = "";
    $scope.endTime = "";
    $scope.registerHandler = function () {
        // Here you can access form data using $scope.formData
        // console.log("Form submitted with data:", $scope);
        var requestData = {
            // Define your request data here
            username: $scope.username,
            password: $scope.password,
            email: $scope.email,
            phone: $scope.phone,
            education: $scope.education,
            speciality: $scope.speciality,
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            role: $scope.role,
        };
        console.log(requestData);

        $http
            .post("http://localhost:3000/register", requestData)
            .then(function (response) {
                // Success callback
                console.log(response);
                localStorage.setItem("userId", response.data._id);
                if (response.data.role == "PATIENT") $location.path("patient");
                else $location.path("doctor");
                // Optionally, update UI or show success message
            })
            .catch(function (error) {
                // Error callback
                console.error("Error making POST request:", error);
                // Optionally, display error message to user
            });
        // // You can perform additional actions like sending data to a server
    };
});
