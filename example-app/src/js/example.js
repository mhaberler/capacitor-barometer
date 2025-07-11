import { Barometer } from '@mhaberler/capacitor-barometer';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    Barometer.echo({ value: inputValue })
}
