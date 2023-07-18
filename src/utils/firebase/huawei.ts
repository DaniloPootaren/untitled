import axios, {AxiosResponse} from 'axios';
import {AndroidNotification} from 'firebase-admin/lib/messaging';

class HuaweiPushConfig {
  // AppId on App Gallery Connect for your app
  private _clientID = 108361755;
  // Client Secret on App Gallery Connect for your app
  private _clientSecret =
    '27990ded7144a5531c5fd3df97628e0948ce3f7777f3dd97d98f76158ec39082';
  private _authUrl = 'https://oauth-login.cloud.huawei.com/oauth2/v3/token';
  private _pushUrl = `https://push-api.cloud.huawei.com/v1/${this._clientID}/messages:send`;
  private _baseUrl = process.env.BASE_URL;

  private _getImageUrl(url: string): string {
    return !this._baseUrl.startsWith('https') ? '' : this._baseUrl.concat(url);
  }

  public getAccessToken(): Promise<
    AxiosResponse<{
      access_token: string;
      token_type: string;
      expires_in: number;
    }>
  > {
    try {
      return axios.post(
        this._authUrl,
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: 'client_credentials',
            client_id: this._clientID,
            client_secret: this._clientSecret,
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  }

  public async sendNotificationToTopic(
    data: any,
    summary: string,
    topic: string,
  ): Promise<void> {
    const response = await this.getAccessToken();

    const {title, description, image} = data;

    await axios.post(
      this._pushUrl,
      {
        validate_only: false,
        message: {
          data: JSON.stringify(data),
          notification: {
            title,
            body: description,
          },
          topic,
          android: {
            collapse_key: -1,
            urgency: 'NORMAL',
            notification: {
              image: this._getImageUrl(image),
              importance: 'NORMAL',
              click_action: {
                type: 3,
              },
              channel_id: 'default',
              style: 0,
              when: new Date(),
              visibility: 'PUBLIC',
              notify_summary: summary,
              foreground_show: false,
            },
          } as AndroidNotification,
        },
      },
      {
        headers: {
          Authorization: 'Bearer ' + response.data.access_token,
        },
      },
    );
  }
}

export const huaweiPushInstance = new HuaweiPushConfig();
