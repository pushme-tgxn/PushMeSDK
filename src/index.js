const axios = require("axios");

const defaultLongPollInterval = 60 * 1000; // 60s
class PushMeSDK {
  constructor({ backendUrl }) {
    this.backendUrl = backendUrl;
    console.log(`this.backendUrl: ${backendUrl}`);
  }

  async getPushStatus(pushIdent) {
    try {
      const pushStatus = await axios.get(
        `${this.backendUrl}/push/${pushIdent}/status`
      );
      // console.log(pushStatus.data);
      return pushStatus.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  // subscribe fn
  async longPollPushStatus(pushIdent) {
    let returnData = null;
    try {
      const pushStatus = await axios.get(
        `${this.backendUrl}/push/${pushIdent}/poll`,
        {
          timeout: defaultLongPollInterval,
        }
      );
      returnData = pushStatus.data;
    } catch (error) {
      console.error(error.toString());
    } finally {
      if (returnData) {
        return returnData;
      } else {
        await this.longPollPushStatus(pushIdent);
      }
    }
  }

  async requestPush(topicSecret, pushData) {
    const requestedPush = await axios.post(
      `${this.backendUrl}/push/${topicSecret}`,
      pushData
    );
    return requestedPush.data;
  }
}

module.exports = PushMeSDK;
