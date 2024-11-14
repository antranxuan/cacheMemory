using DocproPVEP.Customs.Utility;
using DocProUtil;
using DocProUtil.Cf;
using System;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace DocproPVEP
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorCSharpViewEngine());
            Locate.RegisterLocate();
            Locate.SetSchedule(1);
            Loger.Register();
            LicenseConfig.TryLoadLicense();
        }
        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            Utils.Rewrite(Request, Context);
        }
        protected void Application_End()
        {
            //TODO
        }
        protected void Session_Start(object sender, EventArgs e)
        {
            //TODO
        }
        protected void Session_End(object sender, EventArgs e)
        {
            //TODO
        }
    }
}
