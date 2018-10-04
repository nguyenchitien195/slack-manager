
class UserObject extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            "ok": true,
            "user": {
                "id": "",
                "team_id": "",
                "name": "",
                "deleted": false,
                "color": "",
                "real_name": "",
                "tz": "",
                "tz_label": "",
                "tz_offset": -25200,
                "profile": {
                    "avatar_hash": "",
                    "status_text": "",
                    "status_emoji": "",
                    "status_expiration": 0,
                    "real_name": "",
                    "display_name": "",
                    "real_name_normalized": "",
                    "display_name_normalized": "",
                    "email": "",
                    "image_24": "",
                    "image_32": "",
                    "image_48": "",
                    "image_72": "",
                    "image_192": "",
                    "image_512": "",
                    "team": ""
                },
                "is_admin": false,
                "is_owner": false,
                "is_primary_owner": false,
                "is_restricted": false,
                "is_ultra_restricted": false,
                "is_bot": false,
                "is_stranger": false,
                "updated": 0,
                "is_app_user": false,
                "has_2fa": false,
                "locale": ""
            }
        }
    }

}

export default UserObject;