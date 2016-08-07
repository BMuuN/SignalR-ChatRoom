using System.Web.Optimization;

namespace ChatRoom
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/signalr").Include(
                "~/Scripts/jquery.signalR-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/sitechat").Include(
                "~/Scripts/sitechat.js",
                "~/Scripts/sitechat.prototypes.js",
                "~/Scripts/sitechat.storage.js",
                "~/Scripts/sitechat.message.js",
                "~/Scripts/sitechat.message.format.js",
                "~/Scripts/sitechat.notification.js"));
            
            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/Site.css",
                "~/Content/Chat.css"));
        }
    }
}