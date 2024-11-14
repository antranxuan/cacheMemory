using DocproPVEP.Customs.Params;
using DocProModel.Repository;
using DocProUtil;
using DocProUtil.Attributes;
using DocProUtil.Cf;
using System.Web.Mvc;

namespace DocproPVEP.Controllers
{
    public class AccountController : BaseController
    {
        [AclAnonymous]
        public RedirectResult Index(LoginParam loginParam)
        {
            var userSession = UserSessionRepository.GetById(AclConfig.DecodeCode(loginParam.Code));
            if (Utils.IsNotEmpty(userSession)) // && AclConfig.SetLogedInSession(userSession)
            {
                var destination = Utils.Base64Decode(loginParam.Destination);
                return RedirectToPath((destination ?? "/home.html"));
            }
            return RedirectToPath(AclConfig.GetLogoutUrl());
        }
        public RedirectResult Logout()
        {
            AclConfig.SetLogout();
            return RedirectToPath("/home.html", true);
        }
    }
}