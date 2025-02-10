import { OBSWebSocket } from 'obs-websocket-js';

const obs = new OBSWebSocket();

class OBS {
    //contains functions for events
    callBacks: any = {};

    constructor(address: string, password: string) {
        this.connect(address, password);
    }

    private async connect(address: string, password: string) {
        try {
            let connection = await obs.connect(address, password);
            this.callBacks["ConnectionOpened"](connection);
        } catch (error) {
            console.log(error);
        }
    }

    public async on(event: string, callback: Function) {
        this.callBacks[event] = callback;        
    }

    public async getVersion() {
        let res = await obs.call("GetVersion");
        return res;
    }

    public async getStats() {
        let res = await obs.call("GetStats");
        return res;
    }

    public async broadcastCustomEvent(eventData) {
        let res = await obs.call("BroadcastCustomEvent", {eventData});
        return res;
    }

    public async callVendorRequest(vendorName, requestType, requestData?) {
        if (requestData) {
            let res = await obs.call("CallVendorRequest", {vendorName, requestType, requestData});
            return res;
        } else {
            let res = await obs.call("CallVendorRequest", {vendorName, requestType});
            return res;
        }
    }

    public async getHotkeyList() {
        let res = await obs.call("GetHotkeyList");
        return res;
    }

    public async triggerHotkeyByName(hotkeyName, contextName?) {
        if (contextName) {
            let res = await obs.call("TriggerHotkeyByName", {hotkeyName, contextName});
            return res;
        } else {
            let res = await obs.call("TriggerHotkeyByName", {hotkeyName});
            return res;
        }
    }

    public async getPersistentData(realm, slotName) {
        let res = await obs.call("GetPersistentData", {realm, slotName});
        return res;
    }

    public async setPersistentData(realm, slotName, slotValue) {
        let res = await obs.call("SetPersistentData", {realm, slotName, slotValue});
        return res;
    }

    public async getSceneCollectionList() {
        let res = await obs.call("GetSceneCollectionList");
        return res;
    }

    public async setCurrentSceneCollection(sceneCollectionName) {
        let res = await obs.call("SetCurrentSceneCollection", {sceneCollectionName});
        return res;
    }

    public async createSceneCollection(sceneCollectionName) {
        let res = await obs.call("CreateSceneCollection", {sceneCollectionName});
        return res;
    }

    public async getProfileList() {
        let res = await obs.call("GetProfileList");
        return res;
    }

    public async setCurrentProfile(profileName) {
        let res = await obs.call("SetCurrentProfile", {profileName});
        return res;
    }

    public async createProfile(profileName) {
        let res = await obs.call("CreateProfile", {profileName});
        return res;
    }

    public async removeProfile(profileName) {
        let res = await obs.call("RemoveProfile", {profileName});
        return res;
    }

    public async getProfileParameter(parameterCategory, parameterName) {
        let res = await obs.call("GetProfileParameter", {parameterCategory, parameterName});
        return res;
    }

    public async setProfileParameter(parameterCategory, parameterName, parameterValue) {
        let res = await obs.call("SetProfileParameter", {parameterCategory, parameterName, parameterValue});
        return res;
    }

    public async getVideoSettings() {
        let res = await obs.call("GetVideoSettings");
        return res;
    }

    //!TODO
    public async setVideoSettings() {}

    public async getStreamServiceSettings() {
        let res = await obs.call("GetStreamServiceSettings");
        return res;
    }

    public async setStreamServiceSettings(streamServiceType, streamServiceSettings) {
        let res = await obs.call("SetStreamServiceSettings", {streamServiceType, streamServiceSettings});
        return res;
    }

    public async getRecordDirectory() {
        let res = await obs.call("GetRecordDirectory");
        return res;
    }

    public async setRecordDirectory(recordDirectory) {
        let res = await obs.call("SetRecordDirectory", {recordDirectory});
        return res;
    }

    public async getSourceActive(sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("GetSourceActive", {sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("GetSourceActive", {sourceUuid});
            return res;
        } else {
            let res = await obs.call("GetSourceActive");
            return res;
        }
    }

    //TODO
    public async getSourceScreenshot() {}

    public async saveSourceScreenshot() {}

    public async getSceneList() {
        let res = await obs.call("GetSceneList");
        return res;
    }

    public async getGroupList() {
        let res = await obs.call("GetGroupList");
        return res;
    }

    public async getCurrentProgramScene() {
        let res = await obs.call("GetCurrentProgramScene");
        return res;
    }

    public async setCurrentProgramScene(sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("SetCurrentProgramScene", {sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("SetCurrentProgramScene", {sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getCurrentPreviewScene() {
        let res = await obs.call("GetCurrentPreviewScene");
        return res;
    }

    public async setCurrentPreviewScene(sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("SetCurrentPreviewScene", {sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("SetCurrentPreviewScene", {sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async createScene(sceneName) {
        let res = await obs.call("CreateScene", {sceneName});
        return res;
    }

    public async removeScene(sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("RemoveScene", {sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("RemoveScene", {sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async setSceneName(newSceneName, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("SetSceneName", {newSceneName, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("SetSceneName", {newSceneName, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getSceneSceneTransitionOverride(sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneSceneTransitionOverride", {sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneSceneTransitionOverride", {sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async setSceneSceneTransitionOverride(sceneName?, sceneUuid?, transitionName?, transitionDuration?) {
        if (sceneName) {
            let res = await obs.call("SetSceneSceneTransitionOverride", {sceneName, sceneUuid, transitionName, transitionDuration});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("SetSceneSceneTransitionOverride", {sceneUuid, transitionName, transitionDuration});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getInputList(inputKind?) {
        if (inputKind) {
            let res = await obs.call("GetInputList", {inputKind});
            return res;
        } else {
            let res = await obs.call("GetInputList");
            return res;
        }
    }

    public async getInputKindList(unversioned?) {
        if (unversioned) {
            let res = await obs.call("GetInputKindList", {unversioned});
            return res;
        } else {
            let res = await obs.call("GetInputKindList");
            return res;
        }
    }

    public async getSpecialInputs() {
        let res = await obs.call("GetSpecialInputs");
        return res;
    }

    public async createInput(sceneName?, sceneUuid?, inputName?, inputKind?, inputSettings?, sceneItemEnabled?) {
        if (sceneName) {
            let res = await obs.call("CreateInput", {sceneName, sceneUuid, inputName, inputKind, inputSettings, sceneItemEnabled});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("CreateInput", {sceneUuid, inputName, inputKind, inputSettings, sceneItemEnabled});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async removeInput(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("RemoveInput", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("RemoveInput", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputName(newInputName, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetInputName", {newInputName, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputName", {newInputName, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getInputDefaultSettings(inputKind) {
        let res = await obs.call("GetInputDefaultSettings", {inputKind});
        return res;
    }

    public async getInputSettings(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputSettings", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputSettings", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputSettings(inputSettings, inputName?, inputUuid?, overlay?) {
        if (inputName) {
            let res = await obs.call("SetInputSettings", {inputSettings, inputName, inputUuid, overlay});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputSettings", {inputSettings, inputUuid, overlay});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getInputMute(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputMute", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputMute", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputMute(inputMuted, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetInputMute", {inputMuted, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputMute", {inputMuted, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async toggleInputMute(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("ToggleInputMute", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("ToggleInputMute", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getInputVolume(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputVolume", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputVolume", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    //TODO
    public async setInputVolume(inputName?, inputUuid?, inputVolemeMul?, inputVolumeDb?) {
    }

    public async getInputAudioBalance(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputAudioBalance", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputAudioBalance", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputAudioBalance(inputAudioBalance, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetInputAudioBalance", {inputAudioBalance, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputAudioBalance", {inputAudioBalance, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getInputAudioSyncOffset(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputAudioSyncOffset", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputAudioSyncOffset", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputAudioSyncOffset(inputAudioSyncOffset, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetInputAudioSyncOffset", {inputAudioSyncOffset, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputAudioSyncOffset", {inputAudioSyncOffset, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }
 
    public async getInputAudioMonitorType(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputAudioMonitorType", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputAudioMonitorType", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputAudioMonitorType(monitorType, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetInputAudioMonitorType", {monitorType, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputAudioMonitorType", {monitorType, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getInputAudioTracks(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputAudioTracks", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputAudioTracks", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setInputAudioTracks(inputAudioTracks, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetInputAudioTracks", {inputAudioTracks, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetInputAudioTracks", {inputAudioTracks, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getInputPropertiesListPropertyItems(propertyName, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetInputPropertiesListPropertyItems", {propertyName, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetInputPropertiesListPropertyItems", {propertyName, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async pressInputPropertiesButton(propertyName, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("PressInputPropertiesButton", {propertyName, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("PressInputPropertiesButton", {propertyName, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getTransitionKindList() {
        let res = await obs.call("GetTransitionKindList");
        return res;
    }

    public async getSceneTransitionList() {
        let res = await obs.call("GetSceneTransitionList");
        return res;
    }

    public async getCurrentSceneTransition() {
        let res = await obs.call("GetCurrentSceneTransition");
        return res;
    }

    public async setCurrentSceneTransition(transitionName) {
        let res = await obs.call("SetCurrentSceneTransition", {transitionName});
        return res;
    }

    public async setCurrentSceneTransitionDuration(transitionDuration) {
        let res = await obs.call("SetCurrentSceneTransitionDuration", {transitionDuration});
        return res;
    }

    public async setCurrentSceneTransitionSettings(transitionSettings, overlay?) {
        let res = await obs.call("SetCurrentSceneTransitionSettings", {transitionSettings, overlay});
        return res;
    }

    public async getCurrentSceneTransitionCursor() {
        let res = await obs.call("GetCurrentSceneTransitionCursor");
        return res;
    }

    public async triggerStudioModeTransition() {
        let res = await obs.call("TriggerStudioModeTransition");
        return res;
    }

    public async setTBarPosition(position, release?) {
        let res = await obs.call("SetTBarPosition", {position, release});
        return res;
    }

    public async getSourceFilterKindList() {
        let res = await obs.call("GetSourceFilterKindList");
        return res;
    }

    public async getSourceFilterList(sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("GetSourceFilterList", {sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("GetSourceFilterList", {sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async getSourceFilterDefaultSettings(filterKind) {
        let res = await obs.call("GetSourceFilterDefaultSettings", {filterKind});
        return res;
    }

    public async createSourceFilter(filterName, filterKind, sourceName?, sourceUuid?, filterSettings?) {
        if (sourceName) {
            let res = await obs.call("CreateSourceFilter", {filterName, filterKind, sourceName, sourceUuid, filterSettings});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("CreateSourceFilter", {filterName, filterKind, sourceUuid, filterSettings});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async removeSourceFilter(filterName, sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("RemoveSourceFilter", {filterName, sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("RemoveSourceFilter", {filterName, sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async setSourceFilterName(filterName, newFilterName, sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("SetSourceFilterName", {filterName, newFilterName, sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("SetSourceFilterName", {filterName, newFilterName, sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async getSourceFilter(filterName, sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("GetSourceFilter", {filterName, sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("GetSourceFilter", {filterName, sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }
    
    public async setSourceFilterIndex(filterName, filterIndex, sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("SetSourceFilterIndex", {filterName, filterIndex, sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("SetSourceFilterIndex", {filterName, filterIndex, sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async setSourceFilterSettings(filterName, filterSettings, overlay?, sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("SetSourceFilterSettings", {filterName, filterSettings, overlay, sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("SetSourceFilterSettings", {filterName, filterSettings, overlay, sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async setSourceFilterEnabled(filterName, filterEnabled, sourceName?, sourceUuid?) {
        if (sourceName) {
            let res = await obs.call("SetSourceFilterEnabled", {filterName, filterEnabled, sourceName, sourceUuid});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("SetSourceFilterEnabled", {filterName, filterEnabled, sourceUuid});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }

    public async getSceneItemList(sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemList", {sceneName});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemList", {sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getGroupSceneItemList(sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetGroupSceneItemList", {sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetGroupSceneItemList", {sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getSceneItemId(sourceName, sceneName?, sceneUuid?, searchOffset?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemId", {sourceName, sceneName, sceneUuid, searchOffset});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemId", {sourceName, sceneUuid, searchOffset});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getSceneItemSource(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemSource", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemSource", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async createSceneItem(sceneName?, sceneUuid?, sourceName?, sourceUuid?, sceneItemEnabled?) {
        if (sceneName) {
            let res = await obs.call("CreateSceneItem", {sceneName, sceneUuid, sourceName, sourceUuid, sceneItemEnabled});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("CreateSceneItem", {sceneUuid, sourceName, sourceUuid, sceneItemEnabled});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async removeSceneItem(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("RemoveSceneItem", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("RemoveSceneItem", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async duplicateSceneItem(sceneItemId, sceneName?, sceneUuid?, destinationSceneName?, destinationSceneUuid?) {
        if (sceneName) {
            let res = await obs.call("DuplicateSceneItem", {sceneItemId, sceneName, sceneUuid, destinationSceneName, destinationSceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("DuplicateSceneItem", {sceneItemId, sceneUuid, destinationSceneName, destinationSceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getSceneItemTransform(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemTransform", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemTransform", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async setSceneItemTransform(sceneItemId, sceneItemTransform, sceneName?, sceneUuid?) {
        if(!sceneName && !sceneUuid) {
            return new Error("No scene name or uuid provided");
        }

        let requestDataUnfiltered = {};
        requestDataUnfiltered["sceneName"] ??= sceneName;
        requestDataUnfiltered["sceneUuid"] ??= sceneUuid;
        requestDataUnfiltered["sceneItemId"] = sceneItemId;
        requestDataUnfiltered["sceneItemTransform"] = sceneItemTransform;
        let requestData = requestDataUnfiltered as {sceneName: string, sceneItemId: number, sceneItemTransform: {}} | {sceneUuid: string, sceneItemId: number, sceneItemTransform: {}};
        

        return await obs.call("SetSceneItemTransform", requestData);
        // if (sceneName) {
        //     let res = await obs.call("SetSceneItemTransform", {sceneItemId, sceneItemTransform, sceneName});
        //     return res;
        // } if(sceneUuid) {
        //     let res = await obs.call("SetSceneItemTransform", {sceneItemId, sceneItemTransform, sceneUuid});
        //     return res;
        // } else {
        //     return new Error("No scene name or uuid provided");
        // }
    }

    public async getSceneItemEnabled(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemEnabled", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemEnabled", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    //todo
    public async setSceneItemEnabled(sceneItemId, sceneName?, sceneUuid?) {
    }

    public async getSceneItemLocked(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemLocked", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemLocked", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async setSceneItemLocked(sceneItemId, sceneItemLocked, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("SetSceneItemLocked", {sceneItemId, sceneItemLocked, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("SetSceneItemLocked", {sceneItemId, sceneItemLocked, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getSceneItemIndex(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemIndex", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemIndex", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    //todo
    public async setSceneItemIndex(sceneItemId, sceneIndex, sceneName?, sceneUuid?) {
    }

    public async getSceneItemBlendMode(sceneItemId, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("GetSceneItemBlendMode", {sceneItemId, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("GetSceneItemBlendMode", {sceneItemId, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async setSceneItemBlendMode(sceneItemId, sceneItemBlendMode, sceneName?, sceneUuid?) {
        if (sceneName) {
            let res = await obs.call("SetSceneItemBlendMode", {sceneItemId, sceneItemBlendMode, sceneName, sceneUuid});
            return res;
        } if(sceneUuid) {
            let res = await obs.call("SetSceneItemBlendMode", {sceneItemId, sceneItemBlendMode, sceneUuid});
            return res;
        } else {
            return new Error("No scene name or uuid provided");
        }
    }

    public async getVirtualCamStatus() {
        let res = await obs.call("GetVirtualCamStatus");
        return res;
    }

    public async toggleVirtualCam() {
        let res = await obs.call("ToggleVirtualCam");
        return res;
    }

    public async startVirtualCam() {
        let res = await obs.call("StartVirtualCam");
        return res;
    }

    public async stopVirtualCam() {
        let res = await obs.call("StopVirtualCam");
        return res;
    }

    public async getReplayBufferStatus() {
        let res = await obs.call("GetReplayBufferStatus");
        return res;
    }

    public async toggleReplayBuffer() {
        let res = await obs.call("ToggleReplayBuffer");
        return res;
    }

    public async startReplayBuffer() {
        let res = await obs.call("StartReplayBuffer");
        return res;
    }

    public async stopReplayBuffer() {
        let res = await obs.call("StopReplayBuffer");
        return res;
    }

    public async saveReplayBuffer() {
        let res = await obs.call("SaveReplayBuffer");
        return res;
    }

    public async getLastReplayBufferReplay() {
        let res = await obs.call("GetLastReplayBufferReplay");
        return res;
    }

    public async getOutputList() {
        let res = await obs.call("GetOutputList");
        return res;
    }

    public async getOutputStatus(outputName) {
        let res = await obs.call("GetOutputStatus", {outputName});
        return res;
    }

    public async toggleOutput(outputName) {
        let res = await obs.call("ToggleOutput", {outputName});
        return res;
    }

    public async startOutput(outputName) {
        let res = await obs.call("StartOutput", {outputName});
        return res;
    }

    public async stopOutput(outputName) {
        let res = await obs.call("StopOutput", {outputName});
        return res;
    }

    public async getOutputSettings(outputName) {
        let res = await obs.call("GetOutputSettings", {outputName});
        return res;
    }

    public async setOutputSettings(outputName, outputSettings) {
        let res = await obs.call("SetOutputSettings", {outputName, outputSettings});
        return res;
    }

    public async getStreamStatus() {
        let res = await obs.call("GetStreamStatus");
        return res;
    }

    public async toggleStream() {
        let res = await obs.call("ToggleStream");
        return res;
    }

    public async startStream() {
        let res = await obs.call("StartStream");
        return res;
    }

    public async stopStream() {
        let res = await obs.call("StopStream");
        return res;
    }

    public async sendStreamCaption(captionText) {
        let res = await obs.call("SendStreamCaption", {captionText});
        return res;
    }

    public async getRecordStatus() {
        let res = await obs.call("GetRecordStatus");
        return res;
    }

    public async toggleRecord() {
        let res = await obs.call("ToggleRecord");
        return res;
    }

    public async startRecord() {
        let res = await obs.call("StartRecord");
        return res;
    }

    public async stopRecord() {
        let res = await obs.call("StopRecord");
        return res;
    }

    public async toggleRecordPause() {
        let res = await obs.call("ToggleRecordPause");
        return res;
    }

    public async pauseRecord() {
        let res = await obs.call("PauseRecord");
        return res;
    }

    public async resumeRecord() {
        let res = await obs.call("ResumeRecord");
        return res;
    }

    public async splitRecordFile() {
        let res = await obs.call("SplitRecordFile");
        return res;
    }

    public async createRecordChapter(chapterName?) {
        if (chapterName) {
            let res = await obs.call("CreateRecordChapter", {chapterName});
            return res;
        } else {
            let res = await obs.call("CreateRecordChapter");
            return res;
        }
    }

    public async getMediaInputStatus(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("GetMediaInputStatus", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("GetMediaInputStatus", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async setMediaInputCursor(mediaCursor, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("SetMediaInputCursor", {mediaCursor, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("SetMediaInputCursor", {mediaCursor, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async offsetMediaInputCursor(mediaCursorOffset, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("OffsetMediaInputCursor", {mediaCursorOffset, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("OffsetMediaInputCursor", {mediaCursorOffset, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async triggerMediaInputAction(mediaAction, inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("TriggerMediaInputAction", {mediaAction, inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("TriggerMediaInputAction", {mediaAction, inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getStudioModeEnabled() {
        let res = await obs.call("GetStudioModeEnabled");
        return res;
    }

    public async setStudioModeEnabled(studioModeEnabled) {
        let res = await obs.call("SetStudioModeEnabled", {studioModeEnabled});
        return res;
    }

    public async openInputPropertiesDialog(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("OpenInputPropertiesDialog", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("OpenInputPropertiesDialog", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async openInputFiltersDialog(inputName?, inputUuid?) {
        if (inputName) {
            let res = await obs.call("OpenInputFiltersDialog", {inputName, inputUuid});
            return res;
        } if(inputUuid) {
            let res = await obs.call("OpenInputFiltersDialog", {inputUuid});
            return res;
        } else {
            return new Error("No input name or uuid provided");
        }
    }

    public async getMonitorList() {
        let res = await obs.call("GetMonitorList");
        return res;
    }

    public async openVideoMixProjector(videoMixType, monitorIndex?, projectorGeometry?) {
        if (monitorIndex) {
            let res = await obs.call("OpenVideoMixProjector", {videoMixType, monitorIndex, projectorGeometry});
            return res;
        } else {
            let res = await obs.call("OpenVideoMixProjector", {videoMixType});
            return res;
        }
    }

    public async openSourceProjector(sourceName?, sourceUuid?, monitorIndex?, projectorGeometry?) {
        if (sourceName) {
            let res = await obs.call("OpenSourceProjector", {sourceName, sourceUuid, monitorIndex, projectorGeometry});
            return res;
        } if(sourceUuid) {
            let res = await obs.call("OpenSourceProjector", {sourceUuid, monitorIndex, projectorGeometry});
            return res;
        } else {
            return new Error("No source name or uuid provided");
        }
    }
}

module.exports = OBS;