import utils = require("../../utils");
import IExtension = require("../coreplayer-shared-module/iExtension");
import IWellcomeExtension = require("./iWellcomeExtension");
import IProvider = require("../coreplayer-shared-module/iProvider");
import IWellcomeProvider = require("./iWellcomeProvider");
import restrictedFile = require("../wellcomeplayer-dialogues-module/restrictedFileDialogue");
import login = require("../wellcomeplayer-dialogues-module/loginDialogue");
import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseFooter = require("../coreplayer-shared-module/footerPanel");
import footer = require("../wellcomeplayer-extendedfooterpanel-module/footerPanel");
import help = require("../coreplayer-dialogues-module/helpDialogue");
import conditions = require("../wellcomeplayer-dialogues-module/conditionsDialogue");
import baseLeft = require("../coreplayer-shared-module/leftPanel");
import left = require("../coreplayer-treeviewleftpanel-module/treeViewLeftPanel");
import baseRight = require("../coreplayer-shared-module/rightPanel");
import coreMediaElementExtension = require("../../extensions/coreplayer-mediaelement-extension/extension");
import download = require("../wellcomeplayer-dialogues-module/downloadDialogue");

class Behaviours {

	sessionTimer: any;

	constructor(public extension: IWellcomeExtension){

        // track events
        $.subscribe(baseExtension.BaseExtension.CREATED, () => {

            this.trackEvent('Items', 'Viewed', '');

            if (!this.extension.provider.isHomeDomain){
                this.trackVariable(2, 'Embedded', this.extension.provider.domain, 2);
            }

            this.extension.$loginDialogue.find('.close').on('click', () => {
                this.trackEvent('Player Interactions', 'Log in', 'Closed');
            });

            this.extension.$embedDialogue.find('.close').on('click', () => {
                this.trackEvent('Player Interactions', 'Embed', 'Closed');
            });

            this.extension.$downloadDialogue.find('.close').on('click', () => {
                this.trackEvent('Player Interactions', 'Download', 'Closed');
            });

            this.extension.$helpDialogue.find('.close').on('click', () => {
                this.trackEvent('Player Interactions', 'Help', 'Closed');
            });

            this.extension.$conditionsDialogue.find('.close').on('click', () => {
                this.trackEvent('Player Interactions', 'Conditions', 'Closed');
            });

            if (this.extension.$restrictedFileDialogue){
                this.extension.$restrictedFileDialogue.find('.close').on('click', () => {
                    this.trackEvent('Player Interactions', 'Restricted File', 'Closed');
                });
            }

            var seeAlso = this.extension.provider.getSeeAlso();

            if (seeAlso && this.extension.provider.isSeeAlsoEnabled()){
                $.publish(baseExtension.BaseExtension.SHOW_MESSAGE, [seeAlso.markup]);
            }
        });

        $.subscribe(login.LoginDialogue.SHOW_LOGIN_DIALOGUE, () => {
            this.trackEvent('Player Interactions', 'Log in', 'Opened');
        });

        $.subscribe(login.LoginDialogue.VIEW_TERMS, () => {
            this.trackEvent('Player Interactions', 'Ts & Cs', 'Loaded');
        });

        $.subscribe(login.LoginDialogue.VIEW_FULL_TERMS, () => {
            this.trackEvent('Player Interactions', 'Ts & Cs', 'Viewed');
        });

        $.subscribe(login.LoginDialogue.ACCEPT_TERMS, () => {
            this.trackEvent('Player Interactions', 'Ts & Cs', 'Accepted');
        });

        $.subscribe(help.HelpDialogue.SHOW_HELP_DIALOGUE, () => {
            this.trackEvent('Player Interactions', 'Help', 'Opened', '');
        });

        $.subscribe(conditions.ConditionsDialogue.SHOW_CONDITIONS_DIALOGUE, () => {
            this.trackEvent('Player Interactions', 'Conditions', 'Opened', '');
        });

        $.subscribe(footer.FooterPanel.DOWNLOAD, () => {
            this.trackEvent('Player Interactions', 'Download', 'Opened', '');
        });

        $.subscribe(download.DownloadDialogue.PREVIEW, (e, type) => {

            switch (type){
                case "currentViewAsJpg":
                    this.trackEvent('Files', 'Previewed - Current View');
                    break;
                case "wholeImageHighResAsJpg":
                    this.trackEvent('Files', 'Previewed - Whole Image High Res');
                    break;
                case "wholeImageLowResAsJpg":
                    this.trackEvent('Files', 'Previewed - Whole Image Low Res');
                    break;
                case "entireDocumentAsPdf":
                    this.trackEvent('Files', 'Previewed - Entire Document As PDF');
                    break;
            }
        });

        $.subscribe(download.DownloadDialogue.DOWNLOAD, (e, type) => {

            switch (type){
                case "currentViewAsJpg":
                    this.trackEvent('Files', 'Downloaded - Current View');
                    break;
                case "wholeImageHighResAsJpg":
                    this.trackEvent('Files', 'Downloaded - Whole Image High Res');
                    break;
                case "wholeImageLowResAsJpg":
                    this.trackEvent('Files', 'Downloaded - Whole Image Low Res');
                    break;
                case "entireDocumentAsPdf":
                    this.trackEvent('Files', 'Downloaded - Entire Document As PDF');
                    break;
            }
        });

        $.subscribe(footer.FooterPanel.SAVE, () => {
            this.trackEvent('Player Interactions', 'Save to Lightbox', 'Opened', '');
        });

        $.subscribe(baseFooter.FooterPanel.EMBED, () => {
            this.trackEvent('Player Interactions', 'Embed', 'Opened', '');
        });

        $.subscribe(baseExtension.BaseExtension.TOGGLE_FULLSCREEN, () => {
            if (this.extension.isFullScreen) {
                this.trackEvent('Player Interactions', 'Full Screen', 'Exit');
            } else {
                this.trackEvent('Player Interactions', 'Full Screen', 'Enter');
            }
        });

        $.subscribe(baseLeft.LeftPanel.OPEN_LEFT_PANEL, () => {
            this.trackEvent('Player Interactions', 'Left Panel', 'Opened');
        });

        $.subscribe(baseLeft.LeftPanel.CLOSE_LEFT_PANEL, () => {
            this.trackEvent('Player Interactions', 'Left Panel', 'Closed');
        });

        $.subscribe(left.TreeViewLeftPanel.OPEN_TREE_VIEW, () => {
            this.trackEvent('Player Interactions', 'Tree', 'Opened');
        });

        $.subscribe(left.TreeViewLeftPanel.OPEN_THUMBS_VIEW, () => {
            this.trackEvent('Player Interactions', 'Thumbs', 'Opened');
        });

        $.subscribe(baseRight.RightPanel.OPEN_RIGHT_PANEL, () => {
            this.trackEvent('Player Interactions', 'Right Panel', 'Opened');
        });

        $.subscribe(baseRight.RightPanel.CLOSE_RIGHT_PANEL, () => {
            this.trackEvent('Player Interactions', 'Right Panel', 'Closed');
        });

        $.subscribe(restrictedFile.RestrictedFileDialogue.SHOW_RESTRICTED_FILE_DIALOGUE, () => {
            this.trackEvent('Player Interactions', 'Restricted File', 'Opened');
        });

        $.subscribe(coreMediaElementExtension.Extension.MEDIA_PLAYED, () => {
            this.trackEvent('Player Interactions', 'Play');
        });

        $.subscribe(coreMediaElementExtension.Extension.MEDIA_PAUSED, () => {
            this.trackEvent('Player Interactions', 'Pause');
        });

        $.subscribe(coreMediaElementExtension.Extension.MEDIA_ENDED, () => {
            this.trackEvent('Player Interactions', 'Ended');
        });

        // see also
        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, () => {
            var seeAlso = this.extension.provider.getCurrentCanvas().seeAlso;

            if (seeAlso && this.extension.provider.isSeeAlsoEnabled()){
                $.publish(baseExtension.BaseExtension.SHOW_MESSAGE, [seeAlso.markup]);
            } else {
                $.publish(baseExtension.BaseExtension.HIDE_MESSAGE);
            }
        });
	}

    isGuest(): boolean {
        var dispName = $.cookie("wlauthssodisp").b64_to_utf8();
        var userTypeIndex = dispName.indexOf("|~|");

        if (dispName.substr(userTypeIndex + 3, 1) == 'G') {
            return true;
        }

        return false;
    }

    isEmbedEnabled(): boolean {
        return (utils.Utils.getBool(this.extension.provider.config.options.embedEnabled, true) &&
                this.extension.provider.manifest.extensions &&
                this.extension.provider.manifest.extensions.isAllOpen);
    }

	isSaveToLightboxEnabled(): boolean {

        if (!utils.Utils.getBool(this.extension.provider.config.options.saveToLightboxEnabled, true)) return false;
        if (!this.extension.provider.isHomeDomain) return false;
        if (!this.extension.provider.isOnlyInstance) return false;

        return true;
    }

    isDownloadEnabled(): boolean {

        // download enabled?
        if (!utils.Utils.getBool(this.extension.provider.config.options.downloadEnabled, true)) return false;

        switch (this.extension.provider.getManifestType()) {
            case "monograph":
                if (!utils.Utils.getBool(this.extension.provider.config.options.bookDownloadEnabled, true)) {
                    return false;
                }
                break;
            case "video":
                if (!utils.Utils.getBool(this.extension.provider.config.options.videoDownloadEnabled, true)) {
                    return false;
                }
                break;
            case "audio":
                if (!utils.Utils.getBool(this.extension.provider.config.options.audioDownloadEnabled, true)) {
                    return false;
                }
                break;
        }

        // download available?
        if (!this.extension.provider.sequence.extensions.permittedOperations.length) {
            return false;
        }

        return true;
    }

    trackEvent(category: string, action: string, label?: string, value?: any): void{

        // update sliding session expiration.
        this.updateSlidingExpiration();

        if (!label) {
            label = this.getGenericTrackingLabel();
        } else {
            label += ', ' + this.getGenericTrackingLabel();
        }

        if (!value){
            window.trackEvent(category, action, label);
        } else {
            window.trackEvent(category, action, label, parseInt(value));
        }
    }

    trackVariable(slot: number, name: string, value: string, scope: number): void{
        window.trackVariable(slot, name, value, scope);
    }

    getGenericTrackingLabel(): string{
        var moreInfo = (<IWellcomeProvider>this.extension.provider).moreInfo;

        var format = 'n/a';
        var institution = 'n/a';
        var identifier = this.extension.provider.sequence.packageIdentifier;
        var digicode = 'n/a';
        var collectioncode = 'n/a';

        if (moreInfo){
            if (moreInfo.bibDocType) format = moreInfo.bibDocType;
            if (moreInfo.Institution) institution = moreInfo.Institution;
            if (moreInfo.marc759a) digicode = moreInfo.marc759a;
            if (moreInfo.marc905a) collectioncode = moreInfo.marc905a;
        }

        return  'Format: ' + format +
                ', Institution: ' + institution +
                ', Identifier: ' + identifier +
                ', Digicode: ' + digicode +
                ', Collection code: ' + collectioncode +
                ', Uri: ' + this.extension.provider.getEmbedDomain();
    }

    updateSlidingExpiration(): void {

        // not necessary if content is all open.
        if (this.extension.provider.manifest.extensions.isAllOpen) return;

        // some (or all) of the content requires login.
        // if the user has a session, update the sliding expiration.
        if (!this.isLoggedIn()) return;

        var that = this;

        // get ttl.
        $.ajax({
            url: '/service/ttl',
            type: 'GET',
            success: (time) => {
                time = parseInt(time);

                // don't create a session timer if the session has expired.
                if (time == -1) return;

                var ms = time * 1000;

                if (that.sessionTimer) {
                    clearTimeout(that.sessionTimer);
                }

                that.sessionTimer = setTimeout(function () {
                    that.extension.closeActiveDialogue();
                    that.extension.showDialogue(that.extension.provider.config.modules.genericDialogue.content.sessionExpired, () => {
                        that.sessionExpired();
                    }, that.extension.provider.config.modules.genericDialogue.content.refresh, false);
                }, ms);
            }
        });
    }

    sessionExpired(): void {
        this.extension.triggerSocket("onSessionExpired", null);
    }

    allowCloseLogin(): boolean {

        // if there's only one asset in the package, you must login to see anything,
        // so don't allow it to be closed.
        // necessary for video/audio which have no ui to trigger
        // new login event.
        return this.extension.provider.getTotalCanvases() != 1;
    }

    getInadequatePermissionsMessage(canvasIndex): string {

        var section = this.extension.provider.getStructureByCanvasIndex(canvasIndex);

        switch (section.extensions.accessCondition.toLowerCase()) {
            case 'requires registration':
                return this.extension.provider.config.modules.loginDialogue.content.requiresRegistrationPermissionsMessage;
            case 'clinical images':
                return this.extension.provider.config.modules.loginDialogue.content.clinicalImagesPermissionsMessage;
            case 'restricted files':
                return this.extension.provider.config.modules.loginDialogue.content.restrictedFilesPermissionsMessage;
            case 'closed':
                return this.extension.provider.config.modules.loginDialogue.content.closedPermissionsMessage;
        }

        return this.extension.provider.config.modules.loginDialogue.inadequatePermissionsMessage;
    }

    showRestrictedFileDialogue(params): void {
        $.publish(restrictedFile.RestrictedFileDialogue.SHOW_RESTRICTED_FILE_DIALOGUE, [params]);
    }

    isAuthorised(canvasIndex): boolean {

        var section = this.extension.provider.getStructureByCanvasIndex(canvasIndex);

        if (section.extensions.authStatus.toLowerCase() == "allowed") {
            return true;
        }

        return false;
    }

    hasPermissionToViewCurrentItem(): boolean{
        return this.isAuthorised(this.extension.provider.canvasIndex);
    }

    isLoggedIn(): boolean {
        return document.cookie.indexOf("wlauthsso") >= 0;
    }

    showLoginDialogue(params): void {
        // this needs to be postponed otherwise
        // it will trigger before the login event
        // handler is registered.
        setTimeout(() => {
            $.publish(login.LoginDialogue.SHOW_LOGIN_DIALOGUE, [params]);
        }, 1);
    }

    // pass direction as 1 or -1.
    nextAvailableIndex(direction: number, requestedIndex: number) {

        for (var i = requestedIndex; i < this.extension.provider.sequence.assets.length && i >= 0; i += direction) {
            if (i == requestedIndex) continue;
            if (this.isAuthorised(i)) {
                return i;
            }
        }

        return null;
    }

    viewNextAvailableIndex(requestedIndex: number, callback: any): void {

        var nextAvailableIndex;

        if (requestedIndex < this.extension.provider.canvasIndex) {
            nextAvailableIndex = this.nextAvailableIndex(-1, requestedIndex);
        } else {
            nextAvailableIndex = this.nextAvailableIndex(1, requestedIndex);
        }

        if (nextAvailableIndex) {
            callback(nextAvailableIndex);
        } else {
            this.extension.showDialogue(this.extension.provider.config.modules.genericDialogue.content.noRemainingVisibleItems);
        }
    }

    login(params: any) {
        var ajaxOptions: JQueryAjaxSettings = {
            url: this.extension.provider.getLoginUri(params.username, params.password),
            type: "GET",
            dataType: "json",
            xhrFields: { withCredentials: true },
            // success callback
            success: (result: any) => {

                $.publish(login.LoginDialogue.HIDE_LOGIN_DIALOGUE);

                if (result.Message.toLowerCase() == "success") {

                    this.extension.triggerSocket(login.LoginDialogue.LOGIN, result.DisplayNameBase64);

                    this.trackVariable(1, 'Logged in', 'true', 2);

                    params.successCallback(true);

                } else {
                    params.failureCallback(result.Message, true);
                }
            },
            // error callback
            error: (result: any) => {
                 $.publish(login.LoginDialogue.HIDE_LOGIN_DIALOGUE);

                params.failureCallback(this.extension.provider.config.modules.genericDialogue.content.error, true);
            }
        };

        $.ajax(ajaxOptions);
    }

    authorise(canvasIndex: number, successCallback: any, failureCallback: any): void {

        var section = this.extension.provider.getStructureByCanvasIndex(canvasIndex);

        switch (section.extensions.authStatus.toLowerCase()) {
            case 'allowed':
                successCallback(false);
                break;
            case 'denied':
                if (this.isLoggedIn()) { // inadequate permissions
                    // if it's a restricted file, there are no login
                    // credentials to view it, so show restricted file dialogue.
                    if (section.extensions.accessCondition.toLowerCase() === "restricted files") {
                        this.showRestrictedFileDialogue({
                            requestedIndex: canvasIndex,
                            allowClose: this.allowCloseLogin()
                        });
                    } else {
                        this.showLoginDialogue({
                            successCallback: successCallback,
                            failureCallback: failureCallback,
                            inadequatePermissions: true,
                            requestedIndex: canvasIndex,
                            allowClose: this.allowCloseLogin(),
                            message: this.getInadequatePermissionsMessage(canvasIndex)
                        });
                    }
                } else {
                    // if section is 'requires registration', show login as guest option.
                    if (section.extensions.accessCondition.toLowerCase() === "requires registration"){
                        this.showLoginDialogue({
                            successCallback: successCallback,
                            failureCallback: failureCallback,
                            requestedIndex: canvasIndex,
                            allowClose: false,
                            allowGuestLogin: true,
                            title: this.extension.provider.config.modules.loginDialogue.content.loginAsGuestTitle,
                            message: this.extension.provider.config.modules.loginDialogue.content.loginAsGuestText,
                        });
                    } else if (section.extensions.accessCondition.toLowerCase() === "restricted files"){
                        this.showRestrictedFileDialogue({
                            requestedIndex: canvasIndex,
                            allowClose: this.allowCloseLogin()
                        });
                    } else {
                        // don't allow guest login.
                        this.showLoginDialogue({
                            successCallback: successCallback,
                            failureCallback: failureCallback,
                            requestedIndex: canvasIndex,
                            allowClose: this.allowCloseLogin(),
                            allowGuestLogin: false,
                            message: this.getInadequatePermissionsMessage(canvasIndex)
                        });
                    }
                }
                break;
            case 'expired':
                if (this.isGuest()){
                    this.showLoginDialogue({
                        successCallback: successCallback,
                        failureCallback: failureCallback,
                        requestedIndex: canvasIndex,
                        allowClose: false,
                        allowGuestLogin: true,
                        title: this.extension.provider.config.modules.loginDialogue.content.loginAsGuestTitle,
                        message: this.extension.provider.config.modules.loginDialogue.content.loginAsGuestText,
                    });
                } else {
                    this.showLoginDialogue({
                        successCallback: successCallback,
                        failureCallback: failureCallback,
                        message: this.extension.provider.config.modules.loginDialogue.content.loginExpiredMessage,
                        requestedIndex: canvasIndex,
                        allowClose: this.allowCloseLogin()
                    });
                }
                break;
            case 'notacceptedtermsyet':
                this.extension.showDialogue(this.extension.provider.config.modules.genericDialogue.content.notAcceptedTermsYetMessage);
                break;
        }
    }

    // ensures that a file is in the server cache.
    prefetchAsset(canvasIndex: number, successCallback: any): void{
        var asset = this.extension.provider.getCanvasByIndex(canvasIndex);

        var prefetchUri = this.extension.provider.getPrefetchUri(asset);

        $.getJSON(prefetchUri, (result) => {
            if (result.Success) {
                successCallback(asset.fileUri);
            } else {
                this.extension.showDialogue(result.Message);
                return;
            }
        });
    }

    viewIndex(canvasIndex: number, successCallback?: any): void {
        // authorise.
        this.authorise(canvasIndex,
            // success callback
            (reload: boolean) => {
                if (reload) {
                    // reload the package.
                    this.extension.provider.reload(() => {
                        $.publish(baseExtension.BaseExtension.RELOAD);
                        this.viewIndex(canvasIndex, successCallback);
                    });
                } else {

                    this.extension.provider.canvasIndex = canvasIndex;
                    $.publish(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, [canvasIndex]);

                    this.trackEvent('Pages', 'Viewed', 'Index: ' + String(canvasIndex));

                    if (successCallback) {
                        successCallback(canvasIndex);
                    }
                }
            },
            // failure callback.
            (message: string, retry: boolean) => {
                this.extension.showDialogue(message, () => {
                    if (retry) {
                        this.viewIndex(canvasIndex, successCallback);
                    }
                });
            }
        );
    }
}

export = Behaviours;