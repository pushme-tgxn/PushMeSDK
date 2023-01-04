declare module '@pushme-tgxn/pushmesdk';

export declare const BACKEND_URL: string;
export declare const NotificationDefinitions: object;

export declare class PushMeSDK {
    constructor(config?: object);
    public user: User;
    public topic: Topic;
    public device: Device;
    public getBackendUrl(): string;
    public resetBackend(): void;
    public setBackendUrl(backendUrl: string): void;
    public isDefaultBackend(): boolean;
    public setAccessToken(accessToken: string): void;
}

export declare class User {
    constructor(pushMe: PushMeSDK);
    public emailRegister(email: string, password: string, name: string): Promise<any>;
    public emailLogin(email: string, password: string): Promise<any>;
    public updateEmail(email: string): Promise<any>;
    public updatePassword(password: string): Promise<any>;
    public authWithGoogle(idToken: string): Promise<any>;
    public getCurrentUser(): Promise<any>;
    public getPushHistory(): Promise<any>;
    public deleteSelf(): Promise<any>;
}

export declare class Topic {
    constructor(pushMe: PushMeSDK);
    public list(): Promise<any>;
    public getById(topicId: string): Promise<any>;
    public create(): Promise<any>;
    public update(topicId: string, updateData: any): Promise<any>;
    public delete(topicId: string): Promise<any>;
}

export declare class Device {
    constructor(pushMe: PushMeSDK);
    public list(): Promise<any>;
    public getById(deviceId: string): Promise<any>;
    public create(deviceData: any): Promise<any>;
    public update(deviceId: string, updateData: any): Promise<any>;
    public delete(deviceId: string): Promise<any>;
}
