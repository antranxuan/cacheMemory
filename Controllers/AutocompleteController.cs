using DocProLogic.Customs.Builders;
using DocProModel.Customs.Params;
using DocProModel.Models;
using DocProUtil;
using DocProUtil.Attributes;
using DocProUtil.Cf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DocProModel.Repository;

namespace DocproPVEP.Controllers
{
    [AclAuthorize]
    public class AutocompleteController : BaseController
    {
        public JsonResult Channel()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var channels = ChannelRepository.Admin_Search(searchParam.Term);
            if (!Equals(channels, null) && channels.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        channels.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }
                var ids = Utils.GetInts(channels.Select(x => x.Parents).ToList());
                var teamParents = ChannelRepository.Admin_GetByIds(ids);
                foreach (var item in channels)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(item.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new Channel();

                        parentStrs.Add(teamParent.Name ?? string.Empty);
                    }
                    item.Parents = string.Join(GlobalConfig.StrArrow, parentStrs);

                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = item.Parents
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Role()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var roles = RoleRepository.Instance.Search(CUser.IDChannel, searchParam.Term);

            if (!Equals(roles, null) && roles.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        roles.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = Utils.GetInts(roles.Select(x => x.Parents).ToList());
                var teamParents = RoleRepository.Instance.GetByIdsOrDefault(ids);
                foreach (var item in roles)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(item.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new Role();

                        parentStrs.Add(teamParent.Name ?? string.Empty);
                    }
                    item.Parents = string.Join(GlobalConfig.StrArrow, parentStrs);

                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = item.Parents
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Dept()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var depts = DeptRepository.Instance.Search(CUser.IDChannel, searchParam.Term);
            if (!Equals(depts, null) && depts.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        depts.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = Utils.GetInts(depts.Select(x => x.Parents).ToList());
                var teamParents = DeptRepository.Instance.GetByIds(CUser.IDChannel, ids);
                foreach (var item in depts)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(item.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new Dept();
                        if (Utils.IsNotEmpty(teamParent.Name))
                        {
                            parentStrs.Add(teamParent.Name);
                        }
                    }
                    item.Parents = string.Join(GlobalConfig.StrArrow, parentStrs);
                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = item.Parents
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Team()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var teams = TeamRepository.Instance.Search(CUser.IDChannel, searchParam.Term); ;
            if (!Equals(teams, null) && teams.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        teams.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = Utils.GetInts(teams.Select(x => x.Parents).ToList());
                var teamParents = TeamRepository.Instance.GetByIdsOrDefault(CUser.IDChannel, ids);
                foreach (var item in teams)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(item.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new Team();

                        parentStrs.Add(teamParent.Name ?? string.Empty);
                    }
                    item.Parents = string.Join(GlobalConfig.StrArrow, parentStrs);
                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = item.Parents
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Position()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var positions = PositionRepository.Instance.Search(CUser.IDChannel, searchParam.Term);
            if (!Equals(positions, null) && positions.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        positions.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = Utils.GetInts(positions.Select(x => x.Parents).ToList());
                var teamParents = PositionRepository.Instance.GetByIdsOrDefault(CUser.IDChannel, ids);
                foreach (var item in positions)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(item.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new Position();

                        parentStrs.Add(teamParent.Name ?? string.Empty);
                    }
                    item.Parents = string.Join(GlobalConfig.StrArrow, parentStrs);
                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = item.Parents
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Auser()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var users = UserRepository.Instance.Search(CUser.IDChannel, searchParam.Term);
            if (!Equals(users, null) && users.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        users.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = users.Select(x => x.IDDept).ToArray();
                var depts = DeptRepository.Instance.GetByIdsOrDefault(CUser.IDChannel, ids);
                foreach (var item in users)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var dept = depts
                        .Where(x => x.ID == item.IDDept)
                        .SingleOrDefault() ?? new Dept();

                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = dept.Name ?? string.Empty
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Category()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var categories = CategoryRepository.Search(CUser.IDChannel, searchParam.Type, searchParam.Term, searchParam.Code);
            if (!Equals(categories, null) && categories.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        categories.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = Utils.GetInts(categories.Select(x => x.Parents).ToList());
                var teamParents = CategoryRepository.Instance.GetByIds(ids);
                foreach (var category in categories)
                {
                    if (idNotIn.Contains(category.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(category.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new Category();

                        parentStrs.Add(teamParent.Name ?? string.Empty);
                    }

                    items.Add(new
                    {
                        ID = category.ID,
                        Name = category.Name,
                        Parents = string.Join(GlobalConfig.StrArrow, parentStrs)
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Item()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            switch (searchParam.Type)
            {
                case 1:
                    var musics = StgDocRepository.Search(CUser.IDChannel, new DocParam
                    {
                        Term = searchParam.Term,
                        IsAudio = true
                    }, 10);

                    if (!Utils.IsEmpty<StgDoc>(musics))
                    {
                        var idNotIn = new List<long>();
                        if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                        {
                            foreach (var v in searchParam.IDNotIn)
                            {
                                musics.RemoveAll(x => x.ID == v);
                                idNotIn.Add(v);
                            }
                        }
                        foreach (var item in musics)
                        {
                            if (idNotIn.Contains(item.ID))
                                continue;
                            items.Add(new
                            {
                                ID = item.ID,
                                Name = item.Name,
                                Parents = Utils.Summary(item.Describe, 10) ?? string.Empty
                            });
                        }
                    }
                    break;
                case 2:
                    var videos = StgDocRepository.Search(CUser.IDChannel, new DocParam
                    {
                        Term = searchParam.Term,
                        IsVideo = true
                    }, 10);

                    if (!Utils.IsEmpty<StgDoc>(videos))
                    {
                        var idNotIn = new List<long>();
                        if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                        {
                            foreach (var v in searchParam.IDNotIn)
                            {
                                videos.RemoveAll(x => x.ID == v);
                                idNotIn.Add(v);
                            }
                        }
                        foreach (var item in videos)
                        {
                            if (idNotIn.Contains(item.ID))
                                continue;
                            items.Add(new
                            {
                                ID = item.ID,
                                Name = item.Name,
                                Parents = Utils.Summary(item.Describe, 10) ?? string.Empty
                            });
                        }
                    }
                    break;
                default:
                    var stgDocs = StgDocRepository.Search(CUser.IDChannel, new DocParam
                    {
                        Term = searchParam.Term
                    }, 10);

                    if (!Utils.IsEmpty<StgDoc>(stgDocs))
                    {
                        var idNotIn = new List<long>();
                        if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                        {
                            foreach (var v in searchParam.IDNotIn)
                            {
                                stgDocs.RemoveAll(x => x.ID == v);
                                idNotIn.Add(v);
                            }
                        }
                        foreach (var item in stgDocs)
                        {
                            if (idNotIn.Contains(item.ID))
                                continue;
                            items.Add(new
                            {
                                ID = item.ID,
                                Name = item.Name,
                                Parents = Utils.Summary(item.Describe, 10) ?? string.Empty
                            });
                        }
                    }
                    break;
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult OcrForm()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var ocrForms = OcrFormRepository.Instance.Search(CUser.IDChannel, searchParam.Term);
            if (!Utils.IsEmpty<OcrForm>(ocrForms))
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        ocrForms.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                foreach (var item in ocrForms)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = string.Empty
                    });
                }
            }

            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult Notify()
        {
            var searchParam = Utils.Bind<NotifyParam>(DATA);
            searchParam.CurrentUser = CUser;

            var total = 0;
            var notifications = NotificationRepository.Search(searchParam);
            var users = UserRepository.GetDictByNtfs(notifications);
            SetHtmlResponse(NotificationBuilder.NotificationString(notifications, users, out total));

            return GetResult();
        }
        public JsonResult Doctype()
        {
            var items = new List<object>();
            var searchParam = Utils.Bind<SearchParam>(DATA);
            var doctypes = StgDocTypeRepository.Instance.Search(CUser.IDChannel, searchParam.Term);
            if (!Equals(doctypes, null) && doctypes.Any())
            {
                var idNotIn = new List<int>();
                if (Utils.IsNotEmpty<int>(searchParam.IDNotIn))
                {
                    foreach (var v in searchParam.IDNotIn)
                    {
                        doctypes.RemoveAll(x => x.ID == v);
                        idNotIn.Add(v);
                    }
                }

                var ids = Utils.GetInts(doctypes.Select(x => x.Parents).ToList());
                var teamParents = StgDocTypeRepository.Instance.GetByIdsOrDefault(ids);
                foreach (var item in doctypes)
                {
                    if (idNotIn.Contains(item.ID))
                        continue;

                    var parentStrs = new List<string>();
                    var idParents = Utils.ParserInts(item.Parents);
                    foreach (var idParent in idParents)
                    {
                        if (idParent < 1)
                            continue;

                        var teamParent = teamParents
                            .Where(x => x.ID == idParent)
                            .SingleOrDefault() ?? new StgDocType();
                        if (Utils.IsNotEmpty(teamParent.Name))
                        {
                            parentStrs.Add(teamParent.Name);
                        }
                    }
                    items.Add(new
                    {
                        ID = item.ID,
                        Name = item.Name,
                        Parents = string.Join(GlobalConfig.StrArrow, parentStrs)
                    });
                }
            }
            SetOnlyDataResponse(items);
            return GetResult();
        }
        public JsonResult UserRealTime()
        {
            var accessLog = AccessLogRepository.Instance.Search(CUser.IDChannel, new List<CondParam> {
                new CondParam
                {
                    FieldName="Created",
                    Operator =CondOperator.GreaterOrEquals,
                    Value=DateTime.Now.AddSeconds(-1)
                },
                new CondParam
                {
                    FieldName="Created",
                    Operator =CondOperator.LowerOrEquals,
                    Value=DateTime.Now.AddSeconds(1)
                },
            });
            SetOnlyDataResponse(new
            {
                Amount = accessLog.Count,
                Time = Utils.DateTimeDisplay(DateTime.Now, "HH:mm:ss"),
            });
            return GetResult();
        }
       
    }
}