// import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import RtcEngine, { IRtcEngine, RtcConnection, createAgoraRtcEngine } from 'react-native-agora';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addVoiceChatMember, removeVoiceChatMember } from "../store/slices/app.slice";
import { selectUser } from '../store/slices/user.slice';

// interface AudioTracks {
//     localAudioTrack: IMicrophoneAudioTrack | null,
//     remoteAudioTracks: any
// }

const dispatch = useAppDispatch()
const userState = useAppSelector(selectUser);

class Call {
    appid = "56abe9f94a6f4ccc95f862dae383ce98"
    token = ''

    // audioTracks: AudioTracks = {
    //     localAudioTrack: null,
    //     remoteAudioTracks: {},
    // };


    _engine: IRtcEngine = createAgoraRtcEngine();

    // _channel?: 


    constructor() {
        this._engine.initialize({ appId: "56abe9f94a6f4ccc95f862dae383ce98" });

    }

    join = async (roomId: string, rtcUid: number) => {
        this._engine.joinChannel(this.token, roomId, rtcUid, {
            publishMicrophoneTrack: true,
            publishCameraTrack: false
        })


        this._engine.addListener('onUserJoined', (connection: RtcConnection, uid) => { this.handleUserJoined(roomId, uid) })
        this._engine.addListener('onUserOffline', (connection: RtcConnection, uid) => { this.handleUserLeft(roomId,uid) })
        console.log('joined channel', roomId, rtcUid)
        // this.audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // await this._rtcInstance.publish(this.audioTracks.localAudioTrack);
    }


    leave = async () => { 
        this._engine.leaveChannel()
        this._engine.removeAllListeners()
    }


    handleUserJoined = async (roomId: string, index: number) => {
        //add user.uid to app state
        dispatch(addVoiceChatMember({
            uid: userState.chats.chat[roomId].users[index]
        }))
    }


    // handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    //     //4
    //     await this._rtcInstance.subscribe(user, mediaType);

    //     //5
    //     if (mediaType == "audio") {
    //         this.audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
    //         user.audioTrack?.play();
    //     }
    // }


    handleUserLeft = async (roomId: string, index: number) => {
        //remove user.uid from app state 
        dispatch(removeVoiceChatMember({
            uid: userState.chats.chat[roomId].users[index]
        }))
    }
}

// const Call = new Call()
export default new Call()