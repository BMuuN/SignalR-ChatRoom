using ChatRoom.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Threading.Tasks;

namespace ChatRoom
{
    using Microsoft.AspNet.SignalR.Hubs;

    /// <summary>
    /// http://weblogs.asp.net/davidfowler/microsoft-asp-net-signalr
    /// </summary>
    public class ChatHub : Hub
    {
        #region Data Members

        /// <summary>
        /// The number of messages to store in the cache
        /// </summary>
        private const int CacheMessageLimit = 300;

        /// <summary>
        /// A cached list of all connected users
        /// </summary>
        private static readonly List<UserDetail> ConnectedUsers = new List<UserDetail>();

        /// <summary>
        /// A cached list of the last X messages
        /// </summary>
        private static readonly List<MessageDetail> MessageCache = new List<MessageDetail>();

        #endregion

        #region Public Methods

        /// <summary>
        /// Raised when a client connects to the server
        /// </summary>
        /// <param name="username">The username of the client connection to the server</param>
        public void Connect(string username)
        {
            var id = Context.ConnectionId;

            if (ConnectedUsers.Count(x => x.ConnectionId == id) == 0)
            {
                //string username = GetActiveDirectoryUser();
                var user = new UserDetail { ConnectionId = id, UserName = username };
                ConnectedUsers.Add(user);

                // send to caller
                Clients.Caller.onConnected(user.ConnectionId, user.UserName, ConnectedUsers, GetMessageCache());

                // send to all except caller client
                Clients.AllExcept(id).onNewUserConnected(user.ConnectionId, user.UserName);
            }
        }

        /// <summary>
        /// Raised when a client disconnects i.e. browser is closed
        /// </summary>
        /// <returns>Base disconnected task</returns>
        public override Task OnDisconnected(bool stopCalled)
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            if (item != null)
            {
                ConnectedUsers.Remove(item); // remove user form the cached list
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.UserName); // call client disconnect method
            }

            return base.OnDisconnected(stopCalled);
        }

        /// <summary>
        /// Send a message to all users :- the message is displayed in the main chat window
        /// </summary>
        /// <param name="userName">The username of the user sending the message</param>
        /// <param name="message">The message text</param>
        ///[HubMethodName("send_to_all")] // could also use this attribute to identify the method on the client side
        public void SendMessageToAll(string userName, string message)
        {
            DateTime createdDate = DateTime.Now;                            // Store the time the message was sent
            AddMessageToCache(createdDate, userName, message);              // Add the message to the cache
            Clients.All.messageReceived(createdDate, userName, message);    // Broad cast the message to all users
        }

        /// <summary>
        /// Send a message to an individual user :- the message is displayed in the private chat window
        /// </summary>
        /// <param name="userId">The unique user id of the individual user.</param>
        /// <param name="message">The message to send.</param>
        public void SendPrivateMessage(string userId, string message)
        {
            string fromUserId = Context.ConnectionId;
            var toUser = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == userId);
            var fromUser = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == fromUserId);

            if (toUser != null && fromUser != null)
            {
                DateTime createdDate = DateTime.Now;

                // send to awaiting user
                Clients.Client(userId).sendRecievePrivateMessage(fromUserId, createdDate, fromUser.UserName, message);

                // send to caller user
                Clients.Caller.sendRecievePrivateMessage(userId, createdDate, fromUser.UserName, message);
            }
        }

        #endregion

        #region Private Messages

        /// <summary>
        /// Store a user message to the cache.
        /// </summary>
        /// <param name="createdDate">Date and time the message was sent.</param>
        /// <param name="userName">The username of the user who sent the message.</param>
        /// <param name="message">The message text.</param>
        private void AddMessageToCache(DateTime createdDate, string userName, string message)
        {
            MessageCache.Add(new MessageDetail { UserName = userName, Message = message, CreatedDate = createdDate });

            // only store the last X messages
            if (MessageCache.Count > CacheMessageLimit)
            {
                MessageCache.RemoveAt(0);
            }
        }

        /// <summary>
        /// Get the message cache
        /// </summary>
        /// <returns><c>null</c> if the cache is not enabled else returns the message cache</returns>
        private List<MessageDetail> GetMessageCache()
        {
            bool cacheEnabled = false;
            Boolean.TryParse(ConfigurationManager.AppSettings["EnableMessageCache"].ToString(), out cacheEnabled);

            if (cacheEnabled)
            {
                return MessageCache;
            }
            else
            {
                return new List<MessageDetail>();
            }
        }

        /// <summary>
        /// Get the Active Directory user name
        /// http://stackoverflow.com/questions/2957522/accessing-active-directory-from-asp-net-mvc-using-c-sharp
        /// </summary>
        /// <returns>Username of the currently logged in user</returns>
        private string GetActiveDirectoryUser()
        {
            using (var context = new PrincipalContext(ContextType.Domain))
            {
                using (var user = UserPrincipal.FindByIdentity(context, this.Context.User.Identity.Name))
                {
                    //var groups = user.GetAuthorizationGroups();
                    if (user != null)
                    {
                        return user.DisplayName;
                    }
                }
            }

            return this.Context.User.Identity.Name.ToUpper().Replace("DOMAIN\\", string.Empty);
        }

        #endregion
    }
}