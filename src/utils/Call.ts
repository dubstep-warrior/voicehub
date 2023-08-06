// import {
//   ScreenCapturePickerView,
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
// } from "react-native-webrtc";

// export class Call {
//   localMediaStream: MediaStream | null;
//   peerConstraints = {
//     iceServers: [
//       {
//         urls: "stun:stun.l.google.com:19302",
//       },
//     ],
//   };
//   sessionConstraints = {
//     mandatory: {
//       OfferToReceiveAudio: true,
//       OfferToReceiveVideo: true,
//       VoiceActivityDetection: true,
//     },
//   };
//   peerConnection: RTCPeerConnection;
//   constructor() {
//     this.localMediaStream = null;
//     this.peerConnection = new RTCPeerConnection(this.peerConstraints);
//     this.peerConnection.addEventListener(
//       "connectionstatechange",
//       (event) => {}
//     );
//     this.peerConnection.addEventListener("icecandidate", (event) => {});
//     this.peerConnection.addEventListener("icecandidateerror", (event) => {});
//     this.peerConnection.addEventListener(
//       "iceconnectionstatechange",
//       (event) => {}
//     );
//     this.peerConnection.addEventListener(
//       "icegatheringstatechange",
//       (event) => {}
//     );
//     this.peerConnection.addEventListener("negotiationneeded", (event) => {});
//     this.peerConnection.addEventListener("signalingstatechange", (event) => {});
//     this.peerConnection.addEventListener("track", (event) => {});
//   }

//   getMediaStream = async () => {
//     let mediaConstraints = {
//       audio: true,
//       video: {
//         frameRate: 30,
//         facingMode: "user",
//       },
//     };

//     let isVoiceOnly = false;

//     try {
//       const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

//       if (isVoiceOnly) {
//         let videoTrack = mediaStream.getVideoTracks()[0];
//         videoTrack.enabled = false;
//       }

//       this.localMediaStream = mediaStream;
//       if (this.localMediaStream) {
//         this.localMediaStream
//           .getTracks()
//           .forEach((track) =>
//             this.peerConnection.addTrack(
//               track,
//               this.localMediaStream as MediaStream
//             )
//           );
//       }
//     } catch (err) {
//       // Handle Error
//     }
//   };

//   destroyMediaStreams = () => {
//     if (this.localMediaStream) {
//       this.localMediaStream.getTracks().forEach((track) => track.stop());

//       this.localMediaStream = null;
//     }
//   }

//   destroyPeerConnection = () => {
//     if (this.peerConnection) {
//       this.peerConnection.close();
//       this.peerConnection = new RTCPeerConnection(this.peerConstraints);
//     }
//   }

//   createOffer = async () => {
//     try {
//       const offerDescription = await this.peerConnection.createOffer(
//         this.sessionConstraints
//       );
//       await this.peerConnection.setLocalDescription(offerDescription);

//       // Send the offerDescription to the other participant.
//       return {
//         success: true,
//         data: offerDescription
//     }
//     } catch (err) {
//       // Handle Errors

//       return {
//         success: false,
//         data: err
//     }
//     }
//   };


//   createAnswer = async (offerDescription: any) => {
//     try {
//         // Use the received offerDescription 
//         await this.peerConnection.setRemoteDescription(  new RTCSessionDescription( offerDescription ) );
    
//         const answerDescription = await this.peerConnection.createAnswer();
//         await this.peerConnection.setLocalDescription( answerDescription );
        
//         return {
//             success: true,
//             data: answerDescription
//         }
//         // Send the answerDescription back as a response to the offerDescription.
//     } catch( err ) {
//         // Handle Errors
//         return {
//             success: false,
//             data: err
//         }
//     };
//   }
// }
