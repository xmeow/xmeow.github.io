(function(ext){
    var connected = true;
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

    ext.setFaceColor = function(face, colornum){
        console.log("Face "+face+" color "+colornum);
        sendMsg({'proto':'qcoo','data':'data'});
    };
    
    ext.setEffect = function (effect) {
        console.log("Effect "+effect);
        var data = new Uint8Array([0xF0,0x55,0x04, 0x00, 0x02, 0x05, effect]);
        sendMsg({'proto':'qcoo','data':data});
    };

    function processInput(msg) {
        console.log("Input "+msg.proto);
        if(msg.proto=='online'){
            connected = true;
        }
    }

    function sendMsg(msg){
        console.log("send msg: "+msg);
        chrome.runtime.sendMessage('bbdbfcgfdibdoeblkggamnpndbgbekcn', msg, processInput)
        //chrome.runtime.sendMessage('lohclnpicjahbccciannbegiamdbgeln', msg, processInput)
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'Face %d.face color %d', 'setFaceColor','Front','1'],
            [' ', 'Run Effect %n','setEffect',1],

        ],
        menus: {
            face: ['Front', 'Back','Up','Bottom','Left','Right'],
            colornum: ['1','2','3' ]
        },

        url: 'http://qcoo.cc/'
    };

    // Register the extension
    ScratchExtensions.register('Qcoo', descriptor, ext);

})({});
