using DocproPVEP.Customs.Params;
using DocProModel.Models;
using DocproPVEP.Models.DATA;
using DocproPVEP.Models.View;
using DocproPVEP.Repository;
using DocProUtil;
using DocProUtil.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DocProLogic.Customs.Exceptions;
using DocProModel.Repository;
using System.Runtime.Caching;

namespace DocproPVEP.Controllers
{
    [AclAuthorize]
    public class NhanVienController : BaseController
    {
        private string defaultPath = "/nhanvien.html";
        // GET: NhanVien
        public ActionResult Index()
        {
            SetTitle(Locate.T("Danh sách nhân viên"));
            var searchParam = Utils.Bind<SearchParam>(DATA);
            ViewBag.SearchParam = searchParam;

            //phongban
            var cache = MemoryCache.Default;
            var phongbanCache = (List<PhongBan>)cache.Get("phongbans");
            if (phongbanCache == null)
            {
                phongbanCache = PhongBanRepository.GetAll(CUser.IDChannel);
                var policy = new CacheItemPolicy
                {
                    AbsoluteExpiration = DateTime.Now.AddMinutes(2),
                };
                cache.Set("phongbans", phongbanCache, policy);
            }
            ViewBag.phongban = phongbanCache;
            Loger.Log(Utils.Serialize(phongbanCache), "phongbancache");

            Loger.Log(Utils.Serialize(searchParam), "logidpb");

            var datas = NhanVienRepository.Search(CUser.IDChannel, searchParam, Paging).ToList() ?? new List<NhanVien>();
            return GetCustResultOrView(new ViewParam()
            {
                ViewName = "Index",
                ViewNameAjax = "NhanVien",
                Data = new NhanVienModel
                {
                    ActionLinkSearch = Locate.Url(defaultPath),
                    NhanViens = datas ?? new List<NhanVien>(),
                    PhongBans = phongbanCache
                }
            });
        }
        #region create
        public ActionResult Create()
        {
            ViewBag.phongban = PhongBanRepository.GetAll(CUser.IDChannel);
            SetTitle(Locate.T("Thêm mới nhân viên"));
            return GetDialogResultOrView("Create", 600, new NhanVienModel
            {
                Url = Locate.Url("/NhanVien/save.html"),
                NhanVien = new NhanVien(),
                PhongBans = ViewBag.phongban,
                Action = 1,
            }); ;
        }
        public ActionResult Save()
        {
            var NhanVien = Utils.BindCreatedBy<NhanVien>(DATA, CUser.ID);
            if (!IsValidate(NhanVien))
                return GetResultOrRedirectDefault(defaultPath);
            if (NhanVienRepository.Instance.Insert(NhanVien))
                SetSuccess(Locate.T("Thêm mới nhân viên thành công"));
            else
                SetError(Locate.T("Xảy ra lỗi trong quá trình thêm nhân viên"));
            return GetResultOrRedirectDefault(defaultPath);
        }
        private bool IsValidate(NhanVien NhanVien)
        {
            if (NhanVienRepository.CheckCodePhone(CUser.IDChannel, NhanVien.Phone))
            {
                SetError(Locate.T("Số điện thoại nhân viên đã tồn tại"));
            }
            else if (string.IsNullOrEmpty(NhanVien.Name))
            {
                SetError(Locate.T("Tên không được để trống"));
            }
            return !HasError;
        } 
        private bool IsValidateUpdate(string phoned, NhanVien NhanVien)
        {
            if (!NhanVienRepository.CheckCodePhoneUpdate(CUser.IDChannel, phoned,NhanVien.Phone))
            {
                SetError(Locate.T("Số điện thoại nhân viên đã tồn tại"));
            }
            else if (string.IsNullOrEmpty(NhanVien.Name))
            {
                SetError(Locate.T("Tên không được để trống"));
            }
            return !HasError;
        }
        #endregion
        #region update
        public ActionResult Update(int id)
        {
            ViewBag.phongban = PhongBanRepository.GetAll(CUser.IDChannel);
            SetTitle(Locate.T("Cập nhật thông tin danh mục nhân viên"));
            try
            {
                return GetDialogResultOrView("Create", 600, new NhanVienModel
                {
                    Url = Locate.Url("/nhanvien/change.html"),
                    NhanVien = NhanVienRepository.Instance.GetById(id) ?? new NhanVien(),
                    PhongBans = ViewBag.phongban,
                    Action = 1,
                }); ;
            }
            catch (BusinessLogicException ex)
            {
                SetError(Locate.T(ex.Message));
            }
            return GetResultOrRedirectDefault(Locate.Url(defaultPath));
        }

        public ActionResult Change()
        {
            var item = NhanVienRepository.Instance.GetById(Utils.GetInt(DATA, "ID"));
            var NhanVien = Utils.BindUpdatedBy<NhanVien>(item, DATA, CUser.ID);
            if (!IsValidateUpdate(item.Phone, NhanVien))
              return GetResultOrRedirectDefault(defaultPath);
            if (NhanVienRepository.Instance.Update(NhanVien))
                SetSuccess(Locate.T("Cập nhật nhân viên thành công"));
                
            else
                SetError(Locate.T("Xảy ra lỗi trong quá trình cập nhật"));
            Loger.Log(Utils.Serialize(IsValidateUpdate(item.Phone, NhanVien)), "log_check");
            return GetResultOrRedirectDefault(defaultPath);
        }
        #endregion
        #region Delete
        public ActionResult IsDelete(DeleteParam deleteParam)
        {
            var item = NhanVienRepository.Instance.GetById((int)deleteParam.ID);
            if (Equals(item, null))
            {
                SetWarn(Locate.T("Nhân viên không tồn tại"));
                return GetResultOrRedirectDefault(defaultPath);
            }
            return GetDialogResultOrViewDelete(new DeleteParam
            {
                ID = item.ID,
                RedirectPath = GetRedirectOrDefault(defaultPath),
                Action = Locate.Url("/nhanvien/delete.html"),
                BackTitle = Locate.T("Quay lại danh mục nhân viên"),
                ConfTitle = Locate.T("Xóa nhân viên"),
                Title = Locate.T("Xác nhận xóa thông tin nhân viên")
            });
        }
        public ActionResult Delete(DeleteParam deleteParam)
        {
            var NhanVien = NhanVienRepository.Instance.GetById((int)deleteParam.ID);
            if (Utils.IsEmpty(NhanVien))
            {
                SetError(Locate.T("Danh mục nhân viên không tồn tại"));
            }
            else if (NhanVienRepository.Instance.Delete(NhanVien))
                SetSuccess(Locate.T("Xóa danh mục nhân viên thành công"));
            else
                SetError(Locate.T("Lỗi: Xóa nhân viên không thành công"));
            return GetResultOrRedirectDefault(defaultPath);
        }
        //xoa nhieu ban ghi
        public ActionResult IsDeletes(DeletesParam deletesParam)
        {
            Loger.Log(Utils.Serialize(deletesParam), "log_deletes");
            if (!deletesParam.HasID)
            {
                SetWarn(Locate.T("Bạn chưa chọn thể loại cần xóa"));
                return GetResultOrRedirectDefault("/nhanvien.html");
            }
            var items = NhanVienRepository.Instance.GetByIds(deletesParam.IDToInts());
            if (Equals(items, null))
            {
                SetWarn(Locate.T("Các nhân viên cần xóa không còn tồn tại"));
                return GetResultOrRedirectDefault(defaultPath);
            }
            return GetDialogResultOrViewDeletes(new DeletesParam
            {
                ID = items.Select(x => (long)x.ID).ToArray(),
                RedirectPath = GetRedirectOrDefault(defaultPath),
                Action = Locate.Url("/nhanvien/deletes.html"),
                BackTitle = Locate.T("Quay lại danh sách"),
                ConfTitle = Locate.T("Xóa {0}", items.Count),
                Title = Locate.T("Xác nhận xóa {0} nhân viên", items.Count)
            });
        }
        public ActionResult Deletes(DeletesParam deletesParam)
        {
            var items = NhanVienRepository.Instance.GetByIds(deletesParam.IDToInts());
            if (!items.Any())
            {
                SetError(Locate.T("Các thể loại cần xóa không còn tồn tại"));
            }
            else if (NhanVienRepository.Instance.Deletes(items))
            {
                SetSuccess(Locate.T("Xóa {0} thành công", items.Count));
            }
            else
            {
                SetError(Locate.T("Lỗi: Xóa {0} không thành công", items.Count));
            }
            return GetResultOrRedirectDefault(defaultPath);
        }
        #endregion
        #region report
        public ActionResult Report()
        {
            var stt = 0;
            var nhanvienExcels = new List<NhanVienExcel>();
            var nhanviens = NhanVienRepository.Instance.GetListOrDefault(CUser.IDChannel);
            foreach(var nhanvien in nhanviens)
            {
                stt++;
                var nhanvienExcel = new NhanVienExcel
                {
                    Name = nhanvien.Name,
                    Sex = nhanvien.Sex == true ? "Nam" : "Nữ",
                    Phone = nhanvien.Phone,
                    Salary = nhanvien.Salary,
                    Address = nhanvien.Address,
                };
                nhanvienExcels.Add(nhanvienExcel);
            }
            var dicheader = new Dictionary<string, string>
            {
                {Locate.T("Name"), Locate.T("Tên nhân viên") },
                {Locate.T("Sex"), Locate.T("Giới tính") },
                {Locate.T("Phone"), Locate.T("Điện thoại") },
                {Locate.T("Salary"), Locate.T("Lương") },
                {Locate.T("Address"), Locate.T("Địa chỉ") },
            };
            string filename = string.Format("Danh sách nhân viên {0}.xlsx",
                Utils.DateToString(DateTime.Now, "ddMMyyy"));
            string url = "#";
            ExportExcelCommon(nhanvienExcels, dicheader, false, "nhanvien.xlsx", 2, 1, filename, null, ref url);
            return Json(new { success = true, urlFile = url, filename },
                JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}