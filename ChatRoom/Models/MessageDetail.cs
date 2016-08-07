using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatRoom.Models
{
    public class MessageDetail
    {
        public string UserName { get; set; }

        public string Message { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}