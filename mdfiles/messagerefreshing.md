1) The messagelist and directmessagelist components will not auto refresh at intervals.
    a) If the messagelist or directmessagelist components are displaying the bottom message, the messagelist and directmessagelist components will check every 10 seconds for a new message and refresh if a new message is received.
    b) When the messagelist or directmessagelist components are refreshed, the lists will display the bottom message.
2) When the bottom most message is not displayed in the messagelist or directmessagelist components, the user will be notified when new messages are received.
    a) The notification will be a small icon in the top center messagelist and directmessagelist components.
    b) The notification will display the number of new unread messages (records in the messageread table).
    c) The read count will increment everytime a new message for the channel or direct message is received.
    d) When the user clicks the new message notification, the messagelist and directmessagelist components will be refreshed and display the bottom message.
    e) when the user clicks the new message notification, the unread message count will reset.
    e) when the user clicks the new message notification, messages for the user and channel or user and direct message partner in the lists will be deleted from the messageread table.
3) when the user scrolls to the bottom of the messagelist or directmessagelist
    a) the components will refresh and the unread message count will reset.
    b) messages for the user and channel or user and direct message partner in the lists will be deleted from the messageread table.
4) In the sidebar, channels and direct messages will indicate if there are new messages.
5) a user/message read table will be added to the database
    a) channel_id, user_id, message_id will be fields in the table
    b) channel_id will be null for direct messages
    c) when a message is sent to a channel (messagelist) a record will be added for all users in the channel, except the sender.
    d) when a direct message is sent (directmessagelist) a record will be added for the recipient of the direct message.
    e) when the message is seen by a user the record will be deleted from the messageread table.
6) the number of records will be used to calculate the number of unread messages for a user per channel or per direct message partner. 
7) When the user clicks on a channel or direct message partner, the messagelist and directmessagelist components will display the bottom message.
    a) All messages for the user and channel or user and direct message partner in the lists will be deleted from the messageread table.