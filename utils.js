const postActionGesture = (device, action) => {
    try {
        const object = { "device": device,"action": action };
        console.log(object)
        const response = await fetch("http://192.168.0.109/upload", {
            method: "POST",

            body: JSON.stringify(object),

            headers: {

                "Content-type": "application/json",
            },
        });
        const data = response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};
export default postActionGesture;
// m xem đường dẫn đúng ch d