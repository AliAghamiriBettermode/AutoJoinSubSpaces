import BlueBird from "bluebird";

new BlueBird(async (resolve, reject) => {
}).then((result) => {
    if (result) {
        console.log(result);
    }
    process.exit(0);
});