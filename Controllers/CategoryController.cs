using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DocProModel.Customs.Params;
using DocProModel.Models;
using DocProModel.Repository;
using DocproPVEP.Customs.Params;
using DocproPVEP.Models.View;
using DocproPVEP.Repository;
using DocProUtil;
using DocProUtil.Attributes;

namespace DocproPVEP.Controllers
{
    public class CategoryController : BaseController
    {
        private string defaultPath = "/Category.html";
        // GET: Category
        public ActionResult Index(int id = 0)
        {
            var searchParam = Utils.Bind<CategoryParam>(DATA);
            var categoryParent = CategoryRepository.Instance.GetByIdOrDefault(id);
            var type = searchParam.Type == 0 ? categoryParent.Type : searchParam.Type;
            var categoryTypes = CategoryTypeRepository.Instance.GetList(CUser.IDChannel) ?? new List<CategoryType>();
            var categoryType = categoryTypes.Where(x => x.ID == type).SingleOrDefault();
            if (Utils.IsEmpty(categoryType))
            {
                categoryType = new CategoryType();
               // SetError(Locate.T("Loại nội dung không xác định"));
                //return GetResultOrRedirectDefault("/");
            }

            searchParam.Type = 0;
            if (searchParam.IsParams())
            {
                searchParam.Type = type;
                ViewBag.Categories = CategoryRepository.Search(CUser.IDChannel, searchParam, Paging);
            }
            else
            {
                searchParam.Type = type;
                ViewBag.Categories = CategoryRepository.GetByParent(CUser.IDChannel, id, searchParam.Type, Paging);
            }

            ViewBag.SearchParam = searchParam;
            ViewBag.CategoryType = categoryType;
            ViewBag.CategoryTypes = categoryTypes;
            ViewBag.CategoryParent = categoryParent;
            ViewBag.ViewStyles = ViewStyleRepository.GetList();
            ViewBag.CategoryParents = CategoryRepository.Instance.GetByIds(Utils.ParserInts(ViewBag.CategoryParent.Parents));

            SetTitle(string.IsNullOrEmpty(ViewBag.CategoryParent.Name)
                ? Locate.T(ViewBag.CategoryType.Name)
                : Locate.T(ViewBag.CategoryParent.Name)
            );
            return GetCustResultOrView("Index");
        }
        #region Update
        [AclAuthorizeModule(IsUpdate = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult Update(int id)
        {
            var category = CategoryRepository.Instance.GetById(id);
            if (Equals(category, null))
            {
                SetWarn(Locate.T("Thể loại cần chỉnh sửa không còn tồn tại"));
                return GetResultOrRedirectDefault("/category.html");
            }
            var categoryTypes = CategoryTypeRepository.Instance.GetList(CUser.IDChannel) ?? new List<CategoryType>();
            var categoryType = categoryTypes.Where(x => x.ID == category.Type).SingleOrDefault();
            if (Utils.IsEmpty(categoryType))
            {
                SetError(Locate.T("Loại nội dung không xác định"));
                return GetResultOrRedirectDefault("/");
            }

            ViewBag.Category = category;
            ViewBag.CategoryType = categoryType;
            ViewBag.CategoryTypes = categoryTypes;
            ViewBag.CategoryParent = CategoryRepository.Instance.GetByIdOrDefault(category.Parent);
            if (categoryType.Code == "DM_PLT")
            {
                ViewBag.Organ = CategoryRepository.Instance.GetByIdOrDefault(category.IDOrgan);
                ViewBag.StgDocTypes = StgDocTypeRepository.Instance.GetByIdsOrDefault(Utils.ParserInts(category.Doctypes));
            }
            SetTitle(Locate.T(string.Format("Chỉnh sửa {0}", categoryType.Name.ToLowerInvariant())));
            return GetDialogResultOrView(categoryType.Code == "DM_PLT" ? "UpdatePhong" : "Update", 900);
        }
        [AclAuthorizeModule(IsUpdate = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult Change()
        {
            var id = Utils.GetInt(DATA, "ID");
            var parentName = Utils.GetString(DATA, "ParentName");
            var doctypes = Utils.GetInts(DATA, "IDDoctype");

            var origin = new Category();
            var parent = new Category();
            var category = CategoryRepository.Instance.GetById(id);
            if (Equals(category, null))
            {
                SetError(Locate.T("Thể loại cần chỉnh sửa không còn tồn tại"));
                return GetResultOrRedirectDefault("/category.html");
            }

            origin = (Category)category.Clone();
            category.BindUpdatedBy(DATA, CUser.ID);

            if (string.IsNullOrEmpty(category.Name))
            {
                SetError(Locate.T("Tên thể loại không được để trống"));
                return GetResultOrRedirectDefault("/category.html");
            }
            if (Utils.IsEmpty(parentName))
            {
                category.Parent = 0;
            }
            if (category.Parent > 0 && !CategoryRepository.Instance.Exists(category.Parent, out parent))
            {
                SetError(Locate.T("Thể loại được chọn không còn tồn tại"));
                return GetResultOrRedirectDefault("/category.html");
            }
            if (CategoryRepository.Exists(category))
            {
                SetError(Locate.T("Thể loại [{0}] đã tồn tại", category.Name));
                return GetResultOrRedirectDefault("/category.html");
            }
            if (category.Type > 0)
            {
                var categoryType = CategoryTypeRepository.Instance.GetByIdOrDefault(category.Type);
                category.Type = categoryType.ID;
                category.CodeType = categoryType.Code;
            }

            category.Parent = parent.ID;
            category.Parents = Utils.StringParents(parent.Parents, parent.ID);
            category.Doctypes = Utils.IsEmpty<int>(doctypes)
                ? string.Empty
                : string.Join("|", doctypes).Trim('|');
            if (parent.ID > 0)
            {
                category.Type = parent.Type;
                category.CodeType = parent.CodeType;
            }
            if (!Utils.IsChange(category, origin))
            {
                SetNotify(Locate.T("Thông tin thể loại [{0}] không thay đổi", category.Name));
                return GetResultOrRedirectDefault("/category.html");
            }
            category.ApprovedBy = 0;
            category.PublishedBy = 0;
            category.IsApproved = false;
            category.IsPublished = false;
            if (CategoryRepository.Instance.Update(category))
            {
                if (!Equals(category.Parent, origin.Parent)
                    || !Equals(category.Type, origin.Type))
                {
                    CategoryRepository.UpdateParentOrTypes(CUser.IDChannel);
                }
                SetSuccess(Locate.T("Cập nhật thể loại [{0}] thành công", category.Name));
                return GetResultOrRedirectDefault("/category.html");
            }
            else
            {
                SetError(Locate.T("Lỗi: Cập nhật thể loại [{0}] không thành công", category.Name));
                return GetResultOrRedirectDefault("/category.html");
            }
        }

        #endregion
        #region Save

        [AclAuthorizeModule(IsCreate = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult Save()
        {
            var parent = new Category();
            var parentName = Utils.GetString(DATA, "ParentName");
            var doctypes = Utils.GetInts(DATA, "IDDoctype");
            var category = Utils.BindCreatedBy<Category>(DATA, CUser.ID);
            category.IDChannel = CUser.IDChannel;

            var defaultRedirect = string.Format("/category.html?Type={0}", category.Type);
            if (string.IsNullOrEmpty(category.Name))
            {
                SetError(Locate.T("Tên thể loại không được để trống"));
                return GetResultOrRedirectDefault(defaultRedirect);
            }
            if (category.Parent > 0 && !CategoryRepository.Instance.Exists(category.Parent, out parent))
            {
                SetError(Locate.T("Thể loại được chọn không còn tồn tại"));
                return GetResultOrRedirectDefault(defaultRedirect);
            }
            if (parent.Name != parentName)
            {
                parent = new Category();
                category.Parent = 0;
            }
            if (CategoryRepository.Exists(category))
            {
                SetError(Locate.T("Thể loại [{0}] đã tồn tại", category.Name));
                return GetResultOrRedirectDefault(defaultRedirect);
            }
            if (category.Type > 0)
            {
                var categoryType = CategoryTypeRepository.Instance.GetByIdOrDefault(category.Type);
                category.Type = categoryType.ID;
                category.CodeType = categoryType.Code;
            }
            category.Parents = Utils.GetStringParents(parent, category.Parent);
            category.Doctypes = Utils.IsEmpty<int>(doctypes)
                ? string.Empty
                : string.Join("|", doctypes).Trim('|');
            if (parent.ID > 0)
            {
                category.Type = parent.Type;
                category.CodeType = parent.CodeType;
            }

            if (CategoryRepository.Instance.Insert(category))
            {
                SetSuccess(Locate.T("Tạo thể loại [{0}] thành công", category.Name));
                return GetResultOrRedirectDefault(defaultRedirect);
            }
            else
            {
                SetError(Locate.T("Lỗi: Tạo thể loại [{0}] không thành công", category.Name));
                return GetResultOrRedirectDefault(defaultRedirect);
            }
        }

        #endregion

        #region Delete
        [AclAuthorizeModule(IsDelete = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult IsDelete(DeleteParam deleteParam)
        {
            var item = CategoryRepository.Instance.GetById((int)deleteParam.ID);
            if (Equals(item, null))
            {
                SetWarn(Locate.T("Thể loại không còn tồn tại"));
                return GetResultOrRedirectDefault("/category.html");
            }

            var categoryType = CategoryTypeRepository.Instance.GetByIdOrDefault(item.Type);
            return GetDialogResultOrViewDelete(new DeleteParam
            {
                ID = item.ID,
                RedirectPath = GetRedirectOrDefault("/category.html"),
                Action = Locate.Url("/category/delete.html"),
                BackTitle = Locate.T("Quay lại danh sách {0}", categoryType.Name ?? "thể loại"),
                ConfTitle = Locate.T("Xóa {0}: {1} ?", categoryType.Name ?? "thể loại", item.Name),
                Title = Locate.T("Xác nhận xóa {0}", categoryType.Name ?? "thể loại")
            });
        }
        [AclAuthorizeModule(IsDelete = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult IsDeletes(DeletesParam deletesParam)
        {
            if (!deletesParam.HasID)
            {
                SetWarn(Locate.T("Bạn chưa chọn thể loại cần xóa"));
                return GetResultOrRedirectDefault("/category.html");
            }
            var items = CategoryRepository.Instance.GetByIds(deletesParam.IDToInts());
            if (Equals(items, null))
            {
                SetWarn(Locate.T("Các thể loại cần xóa không còn tồn tại"));
                return GetResultOrRedirectDefault("/category.html");
            }
            var categoryType = CategoryTypeRepository.Instance.GetByIdOrDefault(items.FirstOrDefault().Type);
            return GetDialogResultOrViewDeletes(new DeletesParam
            {
                ID = items.Select(x => (long)x.ID).ToArray(),
                RedirectPath = GetRedirectOrDefault("/category.html"),
                Action = Locate.Url("/category/deletes.html"),
                BackTitle = Locate.T("Quay lại danh sách {0}", categoryType.Name ?? "thể loại"),
                ConfTitle = Locate.T("Xóa {0} {1}", items.Count, categoryType.Name ?? "thể loại"),
                Title = Locate.T("Xác nhận xóa {0} {1}", items.Count, categoryType.Name ?? "thể loại")
            });
        }
        [AclAuthorizeModule(IsDelete = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult Delete(DeleteParam deleteParam)
        {
            var item = CategoryRepository.Instance.GetById((int)deleteParam.ID);
            if (Equals(item, null))
            {
                SetError(Locate.T("Thông tin không còn tồn tại"));
            }
            var categoryType = CategoryTypeRepository.Instance.GetByIdOrDefault(item.Type);
            if (CategoryRepository.Instance.Delete(item))
            {
                CategoryRepository.UpdateParentOrTypes(CUser.IDChannel);
                SetSuccess(Locate.T("Xóa {0} [{1}] thành công", categoryType.Name ?? "thể loại", item.Name));
            }
            else
            {
                SetError(Locate.T("Lỗi: xóa {0} [{1}] không thành công", categoryType.Name ?? "thể loại", item.Name));
            }
            return GetResultOrRedirectDefault("/category.html");
        }
        [AclAuthorizeModule(IsDelete = true, Module = (int)IModule.QuanLyDanhMuc)]
        public ActionResult Deletes(DeletesParam deletesParam)
        {
            var items = CategoryRepository.Instance.GetByIds(deletesParam.IDToInts());
            if (Equals(items, null))
            {
                SetError(Locate.T("Các thể loại cần xóa không còn tồn tại"));
            }
            var categoryType = CategoryTypeRepository.Instance.GetByIdOrDefault(items.FirstOrDefault().Type);
            if (CategoryRepository.Instance.Deletes(items))
            {
                CategoryRepository.UpdateParentOrTypes(CUser.IDChannel);
                SetSuccess(Locate.T("Xóa {0} {1} thành công", items.Count, categoryType.Name ?? "thể loại"));
            }
            else
            {
                SetError(Locate.T("Lỗi: Xóa {0} {1} không thành công", items.Count, categoryType.Name ?? "thể loại"));
            }
            return GetResultOrRedirectDefault("/category.html");
        }
        #endregion
    }
}