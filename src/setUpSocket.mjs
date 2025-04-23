import { WebSocketServer } from 'ws';
import Keys from './app/model/Keys.mjs';
import mongoose from 'mongoose';
import ImageHistories from './app/model/ImageHistories.mjs';
import Histories from './app/model/Histories.mjs';
import Fingerprints from './app/model/Fingerprints.mjs';


const { Types } = mongoose;

const esp32Sockets = new Map();
const esp32CamSockets = new Map();
const androidSockets = new Map();

const setUpSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', handleConnection);

  return wss;
};

const printSocketData = () => {
  console.log('esp32 Sockets:');
  esp32Sockets.forEach((value, key) => {
    console.log(`  key: ${key}, Socket: ${JSON.stringify(value)}`);
  });

  console.log('esp32cam Sockets:');
  esp32CamSockets.forEach((value, key) => {
    console.log(`  key: ${key}, Socket: ${JSON.stringify(value)}`);
  });

  console.log('Android Sockets:');
  androidSockets.forEach((value, userID) => {
    console.log(`  UserID: ${userID}, Socket: ${JSON.stringify(value)}`);
  });
};

const handleConnection = (ws, req) => {
  console.log('New connection established');
  printSocketData();

  ws.on('message', (message) => handleMessage(ws, message));
  ws.on('close', () => handleClose(ws));
  ws.on('error', (error) => console.error('WebSocket error:', error));
};

const handleRegister = async (ws, data) => {
  const { device, userID, key } = data;
  const timestamp = new Date().toISOString();

  if (device === 'esp32') {
    esp32Sockets.set(key, { socket: ws, key });
    broadcastStatus({ connected: true });
    sendKeyToAndroid(key);
  } else if (device === 'esp32cam') {
    esp32CamSockets.set(key, { socket: ws, key });
    broadcastStatus({ connected: true });
    sendKeyToAndroid(key);
  } else if (device === 'android') {
    androidSockets.set(userID, { socket: ws, userID });

    // Kiểm tra kích thước của esp32Sockets
    if (esp32Sockets.size > 0) {
      ws.send(JSON.stringify({ type: 'status', data: { connected: true } }));
    } else {
      console.log(`[${timestamp}] No esp32 connections found.`);
    }

    // Kiểm tra kích thước của esp32CamSockets
    if (esp32CamSockets.size > 0) {
      ws.send(JSON.stringify({ type: 'status', data: { connected: true } }));
    } else {
      console.log(`[${timestamp}] No esp32 cam connections found.`);
    }
  }
};

const sendKeyToAndroid = async (key) => {
  const timestamp = new Date().toISOString();
  const keyData = await Keys.findOne({ key }).sort({ createdAt: -1 });
  const userID = keyData?.userID.toString().trim();

  if (androidSockets.has(userID)) {
    const androidSocketInfo = androidSockets.get(userID);
    if (androidSocketInfo) {
      const androidSocket = androidSocketInfo.socket;
      if (androidSocket && androidSocket.readyState === androidSocket.OPEN) {
        androidSocket.send(
          JSON.stringify({
            type: 'key',
            key,
            messageFlow: 'response'
          })
        );
      } else {
        console.log(
          `[${timestamp}] Android socket not open for userID: ${userID}, State: ${androidSocket.readyState}`
        );
      }
    } else {
      console.log(
        `[${timestamp}] No socket information found for userID: ${userID}`
      );
    }
  } else {
    console.log(
      `[${timestamp}] No Android connection found for userID: ${userID}`
    );
    console.log(
      `[${timestamp}] Current Android sockets:`,
      Array.from(androidSockets.entries())
    );
  }
}

const handleVideoData = async (data) => {
  const { videoData, key } = data;
  const timestamp = new Date().toISOString();

  if (key) {
    const keyData = await Keys.findOne({ key }).sort({
      createdAt: -1,
    });

    if (!keyData) {
      console.log(`[${timestamp}] No key data found for key: ${key}`);
      return;
    }

    const trimmedUserID = keyData.userID.toString().trim();

    // Kiểm tra kết nối androidSockets cho userID cụ thể
    if (androidSockets.has(trimmedUserID)) {
      const androidSocketInfo = androidSockets.get(trimmedUserID);
      if (androidSocketInfo) {
        const androidSocket = androidSocketInfo.socket;
        if (androidSocket && androidSocket.readyState === androidSocket.OPEN) {
          androidSocket.send(
            JSON.stringify({
              type: 'videoData',
              data: { videoData, key },
            })
          );
        } else {
          console.log(
            `[${timestamp}] Android socket not open for userID: ${trimmedUserID}, State: ${androidSocket.readyState}`
          );
        }
      } else {
        console.log(
          `[${timestamp}] No socket information found for userID: ${trimmedUserID}`
        );
      }
    } else {
      console.log(
        `[${timestamp}] No Android connection found for userID: ${trimmedUserID}`
      );
      console.log(
        `[${timestamp}] Current Android sockets:`,
        Array.from(androidSockets.entries())
      );
    }
  } else {
    console.log(`[${timestamp}] No key found`);
  }
};

const handleSendMotionDetectionToAndroid = async (data) => {
  const { message, key } = data;
  const timestamp = new Date().toISOString();

  if (key) {
    const keyData = await Keys.findOne({ key }).sort({
      createdAt: -1,
    });

    if (!keyData) {
      console.log(`[${timestamp}] No key data found for key: ${key}`);
      return;
    }

    const trimmedUserID = keyData.userID.toString().trim();

    // Kiểm tra kết nối androidSockets cho userID cụ thể
    if (androidSockets.has(trimmedUserID)) {
      const androidSocketInfo = androidSockets.get(trimmedUserID);
      if (androidSocketInfo) {
        const androidSocket = androidSocketInfo.socket;
        if (androidSocket && androidSocket.readyState === androidSocket.OPEN) {
          androidSocket.send(
            JSON.stringify({
              type: 'motionDetection',
              message,
              key
            })
          );
        } else {
          console.log(
            `[${timestamp}] Android socket not open for userID: ${trimmedUserID}, State: ${androidSocket.readyState}`
          );
        }
      } else {
        console.log(
          `[${timestamp}] No socket information found for userID: ${trimmedUserID}`
        );
      }
    } else {
      console.log(
        `[${timestamp}] No Android connection found for userID: ${trimmedUserID}`
      );
      console.log(
        `[${timestamp}] Current Android sockets:`,
        Array.from(androidSockets.entries())
      );
    }
  } else {
    console.log(`[${timestamp}] No key found`);
  }
};

const handleSendUpdateStateToAndroid = async (data) => {
  const { state, key } = data;
  const timestamp = new Date().toISOString();

  if (key) {
    const keyData = await Keys.findOne({ key }).sort({
      createdAt: -1,
    });

    if (!keyData) {
      console.log(`[${timestamp}] No key data found for key: ${key}`);
      return;
    }

    const trimmedUserID = keyData.userID.toString().trim();

    // Kiểm tra kết nối androidSockets cho userID cụ thể
    if (androidSockets.has(trimmedUserID)) {
      const androidSocketInfo = androidSockets.get(trimmedUserID);
      if (androidSocketInfo) {
        const androidSocket = androidSocketInfo.socket;
        if (androidSocket && androidSocket.readyState === androidSocket.OPEN) {
          androidSocket.send(
            JSON.stringify({
              type: 'updateState',
              state,
              key
            })
          );
        } else {
          console.log(
            `[${timestamp}] Android socket not open for userID: ${trimmedUserID}, State: ${androidSocket.readyState}`
          );
        }
      } else {
        console.log(
          `[${timestamp}] No socket information found for userID: ${trimmedUserID}`
        );
      }
    } else {
      console.log(
        `[${timestamp}] No Android connection found for userID: ${trimmedUserID}`
      );
      console.log(
        `[${timestamp}] Current Android sockets:`,
        Array.from(androidSockets.entries())
      );
    }
  } else {
    console.log(`[${timestamp}] No key found`);
  }
};


// Thêm logging để debug:
const handleMessage = async (ws, message) => {
  try {
    const data = JSON.parse(message);
    console.log('Received message:', data);

    switch (data.type) {
      case 'register':
        await handleRegister(ws, data);
        break;
      case 'videoData':
        await handleVideoData(data);
        break;
      case 'control':
        await handleControl(data);
        break;
      case 'capture':
        await handleCapturePhoto(data);
        break;
      case 'imageData':
        await handleSaveImageUrl(data);
        break;
      case 'getFingerprint':
        await handleGetFingerprint(data);
        break;
        case 'getOpenHistory':
          await handleGetOpenHistory(data);
          break;
      case 'changeState':
        if (data.messageFlow === 'response') {
          await handleSendMessageResponse(data);
        } else {
          await handleSendMessageChangeState(data); //thay đổi trạng thái đóng mở cửa
        }
        break;
      case 'changeKeyPadPassword':
        if (data.messageFlow === 'response') {
          await handleSendMessageResponse(data);
        } else {
          await handleSendMessageChangeKeyPadPassword(data);
        }
        break;
      case 'deleteFingerprint':
        if (data.messageFlow === 'response') {
          await handleSendMessageResponse(data);
        } else {
          await handleSendMessageDeleteFingerprint(data);
        }
        break;
      case 'fingerprintIDs':
        await handleFingerprintIDs(data);
        break;
      case 'fingerprintList':
        if (data.messageFlow === 'response') {
          await handleSendFingerListToAndroidResponse(data);
        }
        break;
      case 'motionDetection':
        await handleSendMotionDetectionToAndroid(data);
        break;
        case 'updateState':
          await handleSendUpdateStateToAndroid(data);
          break;
      default:
        console.log('Unknown message type:', data.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

// Kiểm tra kết nối Android định kỳ:
setInterval(() => {
  androidSockets.forEach((value, userID) => {
    console.log(`UserID: ${userID}, Socket state: ${value.socket.readyState}`);
  });
}, 60000); // Kiểm tra mỗi phút

const handleGetOpenHistory = async (data) => {
  const { key } = data;
  const timestamp = new Date().toISOString();

  try {
    if (key) {
      const keyData = await Keys.findOne({ key }).sort({
        createdAt: -1,
      });
  
      if (!keyData) {
        console.log(`[${timestamp}] No key data found for key: ${key}`);
        return;
      }

      const historiesData = await Histories.find({userID: keyData.userID});
  
      const trimmedUserID = keyData.userID.toString().trim();
  
      // Kiểm tra kết nối androidSockets cho userID cụ thể
      if (androidSockets.has(trimmedUserID)) {
        const androidSocketInfo = androidSockets.get(trimmedUserID);
        if (androidSocketInfo) {
          const androidSocket = androidSocketInfo.socket;
          if (androidSocket && androidSocket.readyState === androidSocket.OPEN) {
            androidSocket.send(
              JSON.stringify({
                type: 'getOpenHistory',
                messageFlow: 'response',
                openHistory: historiesData,
                message: "Lấy dữ liệu lịch sử thành công"
              })
            );
          } else {
            console.log(
              `[${timestamp}] Android socket not open for userID: ${trimmedUserID}, State: ${androidSocket.readyState}`
            );
          }
        } else {
          console.log(
            `[${timestamp}] No socket information found for userID: ${trimmedUserID}`
          );
        }
      } else {
        console.log(
          `[${timestamp}] No Android connection found for userID: ${trimmedUserID}`
        );
        console.log(
          `[${timestamp}] Current Android sockets:`,
          Array.from(androidSockets.entries())
        );
      }
    } else {
      console.log(`[${timestamp}] No key found`);
    }
  } catch (error) {
    console.error(`[${timestamp}] Error handling get open history message:`, error);
    throw error;
  }
}

const handleGetFingerprint = async (data) => {
  const { key } = data;
  const timestamp = new Date().toISOString();

  try {
    // Retrieve the socket connection
    const esp32Socket = esp32Sockets.get(key);

    if (!esp32Socket || esp32Socket.socket.readyState !== esp32Socket.socket.OPEN) {
      console.log(
        `[${timestamp}] Cannot send changeState: esp32 not connected for key: ${key}`
      );
      return;
    }

    // Prepare the change oldPassword, newPassword message
    const changeStateMessage = {
      type: 'getFingerprint',
    };

    // Send the message
    esp32Socket.socket.send(JSON.stringify(changeStateMessage));
  } catch (error) {
    console.error(`[${timestamp}] Error handling changeState message:`, error);
    throw error;
  }

}

const handleFingerprintIDs = async (data) => {
  const { key, fingerprints } = data;
  const timestamp = new Date().toISOString();

  try {
    // Tìm Key document tương ứng
    const keyDoc = await Keys.findOne({ key });
    if (!keyDoc) {
      console.log(`[${timestamp}] No Key document found for key: ${key}`);
      return;
    }

    const userID = keyDoc.userID.toString().trim();

    // Kiểm tra và thêm fingerprints vào database
    for (const fp of fingerprints) {
      const existingFingerprint = await Fingerprints.findOne({ userID, fingerID: fp.fingerID });

      if (existingFingerprint) {
        console.log(`[${timestamp}] Fingerprint with fingerID ${fp.fingerID} already exists.`);
      } else {
        // Nếu fingerprint chưa tồn tại, thêm vào database
        await Fingerprints.create({
          userID: userID,
          fingerID: fp.fingerID,
        });
        console.log(`[${timestamp}] Fingerprint with fingerID ${fp.fingerID} added.`);
      }
    }
  } catch (error) {
    console.error(`[${timestamp}] Error handling send fingerID response:`, error);
  }
};


const handleSendMessageResponse = async (data) => {
  const { status, message, key } = data;
  const timestamp = new Date().toISOString();

  try {
    // Find the associated Android socket
    const keyDoc = await Keys.findOne({ key });
    if (!keyDoc) {
      console.log(`[${timestamp}] No Key document found for key: ${key}`);
      return;
    }

    const userID = keyDoc.userID.toString().trim();
    const androidSocketInfo = androidSockets.get(userID);

    if (androidSocketInfo && androidSocketInfo.socket.readyState === androidSocketInfo.socket.OPEN) {
      // Forward the response to the Android client
      androidSocketInfo.socket.send(JSON.stringify({
        type: data.type,
        messageFlow: 'response',
        status,
        message
      }));
    } else {
      console.log(`[${timestamp}] No active Android socket found for user: ${userID}`);
    }
  } catch (error) {
    console.error(`[${timestamp}] Error handling changeState response:`, error);
  }
};

// Hàm gửi thông điệp điều khiển và xử lý trạng thái
const handleControl = async (data) => {
  const { key, direction } = data;
  const timestamp = new Date().toISOString();

  try {
    const esp32CamSocket = esp32CamSockets.get(key);

    // Kiểm tra kết nối WebSocket
    if (!esp32CamSocket || esp32CamSocket.socket.readyState !== esp32CamSocket.socket.OPEN) {
      console.log(
        `[${timestamp}] Cannot send control: esp32 not connected for key: ${key}`
      );
      return;
    }

    // Gửi thông điệp điều khiển
    const controlMessage = {
      type: 'control',
      direction
    };

    esp32CamSocket.socket.send(JSON.stringify(controlMessage));
  } catch (error) {
    console.error(`[${timestamp}] Error handling control message:`, error);
  }
};

const handleSendMessageChangeKeyPadPassword = async (data) => {
  const { key, oldPassword, newPassword } = data;
  const timestamp = new Date().toISOString();

  try {
    // Retrieve the socket connection
    const esp32Socket = esp32Sockets.get(key);

    if (!esp32Socket || esp32Socket.socket.readyState !== esp32Socket.socket.OPEN) {
      console.log(
        `[${timestamp}] Cannot send changeState: esp32Cam not connected for key: ${key}`
      );
      return;
    }

    // Prepare the change oldPassword, newPassword message
    const changeStateMessage = {
      type: 'changeKeyPadPassword',
      oldPassword, newPassword
    };

    // Send the message
    esp32Socket.socket.send(JSON.stringify(changeStateMessage));

  } catch (error) {
    console.error(`[${timestamp}] Error handling changeState message:`, error);
    throw error;
  }
}

const handleSendMessageDeleteFingerprint = async (data) => {
  const { key, fingerprintID } = data;
  const timestamp = new Date().toISOString();

  try {
    // Retrieve the socket connection
    const esp32Socket = esp32Sockets.get(key);

    if (!esp32Socket || esp32Socket.socket.readyState !== esp32Socket.socket.OPEN) {
      console.log(
        `[${timestamp}] Cannot send changeState: esp32Cam not connected for key: ${key}`
      );
      return;
    }

    const fingerprintDoc = await Fingerprints.findById(fingerprintID);

    if (!fingerprintDoc) {
      console.log(`[${timestamp}] No fingerprint document found for fingerprintID: ${fingerprintID}`);
      return;
    }

    // Prepare the change oldPassword, newPassword message
    const changeStateMessage = {
      type: 'deleteFingerprint',
      fingerprintID: fingerprintDoc.fingerID
    };

    // Send the message
    esp32Socket.socket.send(JSON.stringify(changeStateMessage));

    await Fingerprints.findByIdAndDelete(fingerprintDoc._id);

  } catch (error) {
    console.error(`[${timestamp}] Error handling changeState message:`, error);
    throw error;
  }
}

const handleSendMessageChangeState = async (data) => {
  const { key, state } = data;
  const timestamp = new Date().toISOString();

  try {
    // Retrieve the socket connection dựa vào key lấy user id 
    const esp32Socket = esp32Sockets.get(key);

    if (!esp32Socket || esp32Socket.socket.readyState !== esp32Socket.socket.OPEN) {
      console.log(
        `[${timestamp}] Cannot send changeState: esp32Cam not connected for key: ${key}`
      );
      return;
    }

    // Find the Key document to get the userID nếu tìm thấy thì lấy ra user id
    const keyDoc = await Keys.findOne({ key: key });
    if (!keyDoc) {
      console.log(`[${timestamp}] No Key document found for key: ${key}`);
      return;
    }

    // Prepare the change state message khở tạo message để gửi đi
    const changeStateMessage = {
      type: 'changeState',
      state
    };

    // Send the message gửi message qua esp32
    return new Promise((resolve, reject) => {
      esp32Socket.socket.send(JSON.stringify(changeStateMessage), async (error) => {
        if (error) {
          console.error(`[${timestamp}] Send error:`, error);
          reject(error);
          return;
        }

        try {
          // Create a new document in the Histories collection
          const historyDoc = new Histories({
            userID: keyDoc.userID,
            state: state,
          });

          await historyDoc.save();

          console.log(`[${timestamp}] State change logged for user ${keyDoc.userID}`);
          resolve(historyDoc);
        } catch (saveError) {
          console.error(`[${timestamp}] Error saving history document:`, saveError);
          reject(saveError);
        }
      });
    });

  } catch (error) {
    console.error(`[${timestamp}] Error handling changeState message:`, error);
    throw error;
  }
};

const handleCapturePhoto = async (data) => {
  const { key } = data;
  const timestamp = new Date().toISOString();

  try {
    const esp32CamSocket = esp32CamSockets.get(key);

    // Kiểm tra kết nối WebSocket
    if (!esp32CamSocket || esp32CamSocket.socket.readyState !== esp32CamSocket.socket.OPEN) {
      console.log(
        `[${timestamp}] Cannot send control: esp32Cam not connected for key: ${key}`
      );
      return;
    }

    // Gửi thông điệp điều khiển
    const controlMessage = {
      type: 'capture',
    };

    esp32CamSocket.socket.send(JSON.stringify(controlMessage));
  } catch (error) {
    console.error(`[${timestamp}] Error handling control message:`, error);
  }

}

const handleSaveImageUrl = async (data) => {
  const { key, imageData } = data;
  const timestamp = new Date().toISOString();
  try {
    const userKey = await Keys.findOne({ key });
    const uploadResult = await ImageHistories.uploadFileToCloudinary(imageData);
    if (!uploadResult.status) {
      return;
    } else {
      console.log("upload", uploadResult.imageUrl);
      const newImageHistory = new ImageHistories({
        userID: userKey.userID,
        imageUrl: uploadResult.imageUrl
      });
      await newImageHistory.save(); //lưu vào đb
    }
  } catch (error) {
    console.error(`[${timestamp}] Error save image url:`, error);
  }
}

const handleClose = (ws) => {
  const timestamp = new Date().toISOString();

  esp32Sockets.forEach((value, key) => {
    if (value.socket === ws) {
      esp32Sockets.delete(key);
      console.log(`[${timestamp}] esp32 disconnected:`, key);
      broadcastStatus({ connected: false });
    }
  });

  esp32CamSockets.forEach((value, key) => {
    if (value.socket === ws) {
      esp32CamSockets.delete(key);
      console.log(`[${timestamp}] esp32 cam disconnected:`, key);
      broadcastStatus({ connected: false });
    }
  });

  androidSockets.forEach((value, userID) => {
    if (value.socket === ws) {
      console.log(`[${timestamp}] Android disconnected:`, userID);
      androidSockets.delete(userID);
    }
  });
};

const broadcastStatus = (status) => {
  const timestamp = new Date().toISOString();
  if (androidSockets.size > 0) {
    androidSockets.forEach(({ socket }, userID) => {
      if (socket.readyState === socket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: 'status', data: status }));
        } catch (error) {
          console.log(
            `[${timestamp}] Error sending broadcast status to Android userID: ${userID}`,
            error
          );
        }
      } else {
        console.log(
          `[${timestamp}] Cannot broadcast status to Android userID: ${userID}, socket not open`
        );
      }
    });
  } else {
    console.log(`[${timestamp}] No Android sockets available to broadcast status.`);
  }
};

export default setUpSocket;
