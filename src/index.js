const axios = require("axios");

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
  async longPollStatus(pushIdent) {
    let returnData = null;
    try {
      const pushStatus = await axios.get(
        `${this.backendUrl}/push/${pushIdent}/poll`,
        {
          timeout: 60 * 1000, // 60s
        }
      );
      returnData = pushStatus.data;
    } catch (error) {
      console.error(error.toString());
    } finally {
      if (returnData) {
        return returnData;
      } else {
        await longPollStatus(pushIdent);
      }
    }
  }

  async requestPush(topicSecret, pushData) {
    return axios.post(`${this.backendUrl}/push/${topicSecret}`, pushData);
  }
}

module.exports = PushMeSDK;
