Project Overview

slackgauntlet project is a Slack-like chat application designed for the GauntletAI bootcamp to facilitate communication, collaboration, and content sharing among users. It will include real-time messaging, channel management, user roles, and file sharing, all integrated with Clerk for authentication.
User Roles & Core Workflows

    User: Can register, log in, create or join workspaces, send messages, share files, and manage their profile.
    Admin: Can manage workspaces, assign roles, invite/remove users, and moderate content.
    User Workflow: Registers, logs in, joins workspaces, sends messages, and shares files in channels.
    Admin Workflow: Creates workspaces, assigns roles, invites/removes users, and manages channels.
    Messaging Workflow: Users send, receive, and search messages in channels or direct messages.
    File Sharing Workflow: Users upload and download files attached to messages.
    Channel Management Workflow: Admins create and manage public/private channels in workspaces.

Technical Foundation

    Frontend: Next.js for server-side rendering and routing.
    Backend: Node.js/Express for API handling.
    Database: PostgreSQL for storing user, workspace, channel, message, and file data.
    Authentication: Clerk for user authentication and role management.
    Real-time Messaging: WebSockets (e.g., Socket.io) for real-time message delivery.

Data Models

    User: id, name, email, profile_picture, status, created_at, updated_at.
    Workspace: id, name, description, created_at, updated_at.
    WorkspaceUser: id, workspace_id, user_id, role, joined_at.
    Channel: id, workspace_id, name, is_private, created_at, updated_at.
    ChannelUser: id, channel_id, user_id, joined_at.
    Message: id, channel_id, user_id, content, created_at, updated_at.
    File: id, message_id, url, file_type, created_at.

API Endpoints

    POST /api/auth/register – User registration.
    POST /api/auth/login – User login.
    GET /api/user/me – Get authenticated user profile.
    PATCH /api/user/me – Update user profile.
    POST /api/workspaces – Create a new workspace (admin only).
    GET /api/workspaces – Get list of workspaces for the user.
    POST /api/workspaces/{workspaceId}/users – Invite a user to a workspace (admin only).
    DELETE /api/workspaces/{workspaceId}/users/{userId} – Remove user from workspace (admin only).
    POST /api/workspaces/{workspaceId}/channels – Create a new channel.
    GET /api/workspaces/{workspaceId}/channels – Get list of channels in a workspace.
    POST /api/channels/{channelId}/messages – Send a message in a channel.
    GET /api/channels/{channelId}/messages – Get messages from a channel.
    POST /api/messages/{messageId}/files – Upload a file to a message.
    GET /api/files/{fileId} – Retrieve a file.

Key Components

    Header: Navigation bar with workspace selection and user profile.
    Sidebar: List of channels and workspaces, with options to create new ones.
    Message List: Displays messages within a channel.
    Message Input: Allows users to type and send messages.
    File Upload: Allows users to attach files to messages.
    User List: Displays users in a workspace or channel with management options.
    Notification Bell: Displays real-time notifications for mentions and messages.

MVP Launch Requirements

    User Authentication: Users must be able to register, log in, and manage their profiles via Clerk.
    Workspace Creation: Admins must be able to create workspaces and manage memberships.
    Channel Management: Admins must be able to create and manage channels within workspaces.
    Real-time Messaging: Users must be able to send and receive messages in real time.
    File Sharing: Users must be able to upload and download files within messages.
    User Roles: Admins must be able to assign/remove roles (user/admin) in workspaces.
    Basic UI: A functional UI with workspace/channel navigation, message input, and message display.
    Basic Notifications: Users must receive notifications for mentions and direct messages.
    Database Setup: PostgreSQL database must be set up with all required models and relationships.