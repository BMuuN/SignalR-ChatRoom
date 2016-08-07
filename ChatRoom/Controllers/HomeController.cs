using System;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChatRoom.Controllers
{
    //[Authorize]
    public class HomeController : Controller
    {
        // Ensure the user is logged in, validate against any XSS
        //[HttpPost, Authorize, ValidateAntiForgeryToken]
        public ActionResult Index()
        {
            ViewBag.Message = "Chat";
            return View();
        }
    }
}
