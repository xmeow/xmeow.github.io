
(function(ext){
    var connected = false;
    var notifyConnection = false;
    var device = null;

    ext._getStatus = function() {
        if (!connected){
            sendMsg({'proto':'probe'}); // check if host app online
            return { status:1, msg:'Disconnected' };
        }else{

            return { status:2, msg:'Connected' };
        }
    };

    ext._deviceRemoved = function(dev) {
        console.log('Device removed');
        // Not currently implemented with serial devices
    };

    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        console.log("Device Connected "+dev.id);
    };

    ext._shutdown = function() {
        // TODO: Bring all pins down
        if (device) device.close();
        if (poller) clearInterval(poller);
        device = null;
    };

    ext.armFlight = function(armed){
        console.log("arm flight "+ armed);
    };

    ext.runMotor =  function(motor, speed){
        console.log("run motor "+motor+" "+speed);
    };

    function processInput(msg) {
        console.log("Input "+msg.proto);
        if(msg.proto=='online'){
            connected = true;
        }
    }

    function sendMsg(msg){
        chrome.runtime.sendMessage('jpjcdkjcfocfcmaclpjecofnamihkfim', msg, processInput)
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['r', 'hello', 'sayHello'],
            [' ', 'Arm Flight %d','armFlight',0],
            [' ', 'Run Motor %d.motorQuad at speed %d.motorPWM','runMotor', "LF", 0],
            [' ', 'Go %d.flightDir at speed %d','runDirection', "Forward", 100],
            [' ', 'Rotate %d.flightRotate at speed %d','runRotate', "CR", 100],
            [' ', 'Altitude %d.flightAltitude at speed %d','runAltitude','UP',100]
        ],
        menus: {
            armed: ['on', 'off'],
            motorQuad:["LF","RF","LB","RB"],
            motorPWM:[0,50,100,255],
            flightDir:['Forward',"Backward","Left","Right"],
            flightRotate:['CR','CCR'],
            flightAltitude:['UP','DOWN']
        },

        url: 'http://litebee.cc/'
    };

    // Register the extension
    ScratchExtensions.register('litebee', descriptor, ext);

})({});











