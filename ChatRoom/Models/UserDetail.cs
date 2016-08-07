using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatRoom.Models
{
    public class UserDetail
    {
        public string ConnectionId { get; set; }

        public string UserName { get; set; }

        ////public string ActiveDirectoryUserName { get; set; }

        ////public string UserName
        ////{
        ////    get
        ////    {
        ////        var name = string.Empty;

        ////        if (ActiveDirectoryUserName.Contains("\\"))
        ////        {
        ////            name = ActiveDirectoryUserName.Substring(ActiveDirectoryUserName.IndexOf("\\") + 1);
        ////        }
        ////        else
        ////        {
        ////            name = this.ActiveDirectoryUserName;
        ////        }

        ////        return name;
        ////    }
        ////}
    }
}