// @ts-nocheck
import {Session} from '@shopify/shopify-api';

export class SessionStorage {
  constructor() {
    this.baseURL = `${process.env.SERVER_BASE_URL}/api/v2/merchant/sessions`;
  }

  async storeSession(session) {
    try {
      const sessionObject = { ...session };
      const convertedSessionObject = {
        session_id: sessionObject.id,
        shop_domain: sessionObject.shop,
        state: sessionObject.state,
        is_online: sessionObject.isOnline,
        access_token: sessionObject.accessToken,
        scope: sessionObject.scope,
        expires: sessionObject.expires || null,
      };
      const response =  await fetch(`${this.baseURL}/store_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertedSessionObject),
      });
      return response.ok
    } 
    catch (error) {
      console.log('Error storing session:', error);
      return false;
    }
  };

  async loadSession(sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/load_session?session_id=${sessionId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const sessionData = await response.json();
      if (response.ok) {
        console.log('Session Found:', sessionData);
        return Session.fromPropertyArray(
          this.convertToSessionArray(sessionData)
        );
      }
      else {
        return undefined;
      }
    } catch (error) {
      console.error('Error loading session:', error);
      return undefined;
    }
  };

  async deleteSession(sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/delete_session?session_id=${sessionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok
    } 
    catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  async deleteSessions(sessionIds) {
    try {
      const response = await fetch(`${this.baseURL}/delete_sessions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: sessionIds }),
      });
      return response.ok
    } 
    catch (error) {
      console.log('Error deleting sessions:', error);
    }
  };

  async findSessionsByShop(ShopDomain) {
    try {
      const response = await fetch(`${this.baseURL}/find_by_shop?domain=${ShopDomain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const sessionData = await response.json();
        return sessionData.map((shopData) =>
          Session.fromPropertyArray(this.convertToSessionArray(shopData))
        );
      }
      else {
        return [];
      }
    } catch (error) {
      console.log('Error finding sessions by shop:', error);
    }
  };

  convertToSessionArray(data) {
    return [
      ["id", data.session_id.toString()],
      ["shop", data.shop_domain],
      ["state", data.state],
      ["isOnline", data.is_online],
      ["scope", data.scope],
      ["expires", data.expires],
      ["accessToken", data.access_token],
    ];
  }
}
