using DocProUtil.Cf;
using System;
using System.Web.Mvc;
using System.Web.Routing;

namespace DocproPVEP
{
    public class RouteConfig
    {
        private static DateTime lastChecked;
        public static void RegisterRoutes(RouteCollection routes)
        {
            lastChecked = DateTime.Now;
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            (new RouteInfoConfig
            {
                Name = "Barcode",
                ProjectName = "DocProDard",
                Namespace = "DocproPVEP.Controllers",
                Controller = "Barcode",
                Url = "barcode/{*text}",
                Action = "Index",
                Id = UrlParameter.Optional
            })
            .Add(routes);

            (new RouteInfoConfig
            {
                Name = "Thumb",
                ProjectName = "DocProDard",
                Namespace = "DocproPVEP.Controllers",
                Controller = "Thumb",
                Url = "thumb/{w}x{h}/{*path}",
                Action = "Index",
                Id = UrlParameter.Optional
            })
            .Add(routes);

            (new RouteInfoConfig
            {
                Name = "Crop",
                ProjectName = "DocProDard",
                Namespace = "DocproPVEP.Controllers",
                Controller = "Crop",
                Url = "crop/{w}x{h}/{*path}",
                Action = "Index",
                Id = UrlParameter.Optional
            })
            .Add(routes);

            (new RouteInfoConfig
            {
                Name = "Home",
                ProjectName = "DocProDard",
                Namespace = "DocproPVEP.Controllers",
                Controller = "Home",
                Url = "{controller}/{action}/{id}",
                Action = "Index",
                Id = UrlParameter.Optional
            })
            .Add(routes);
        }
    }
}
