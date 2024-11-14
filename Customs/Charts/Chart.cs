using System;
using System.Collections;
using System.Globalization;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace DocproPVEP.Customs.Charts
{
    public abstract class Chart
    {
        private const int OneMon = 30*60*60*24;
        private const int OneYear = 365*60*60*24;
        private Hashtable _data;

        public string GetDataSerialize()
        {
            return JsonConvert.SerializeObject(_data);
        }

        public Hashtable GetData()
        {
            return _data;
        }

        protected Hashtable GetXInfo(DateTime st, DateTime et)
        {
            var diff = Math.Abs(date2Int(et) - date2Int(st));
            var y = (int) Math.Ceiling((decimal) (diff/OneYear));
            var m = (int) Math.Ceiling((decimal) ((diff - y*OneYear)/OneMon));

            long from, to;
            string format, step;

            // >1year1mon thi hien thi theo year.
            if (y >= 1 && m > 1)
            {
                step = "year";
                format = "yyyy";
                from = DateTime.ParseExact(st.ToString("yyyy"), "yyyy", CultureInfo.InvariantCulture).Ticks;
                to = DateTime.ParseExact(et.ToString("yyyy"), "yyyy", CultureInfo.InvariantCulture).Ticks + OneYear - 1;
            }
            // >1mon1day thi hien thi theo month.
            else if (m >= 1 || y >= 1)
            {
                step = "month";
                format = "MM-yyyy";
                from = DateTime.ParseExact(st.ToString("MM-yyyy"), "MM-yyyy", CultureInfo.InvariantCulture).Ticks;
                to = DateTime.ParseExact(et.ToString("MM-yyyy"), "MM-yyyy", CultureInfo.InvariantCulture).Ticks + OneMon - 1;
            }
            // mac dinh hien thi theo day.
            else
            {
                step = "day";
                format = "dd-MM-yyyy";
                from = st.Ticks;
                to = et.Ticks;
            }

            var categories = new ArrayList();
            for (var i = from; i <= to; i = incStep(i, step))
                categories.Add((new DateTime(i)).ToString(format));

            return new Hashtable
            {
                {"format", format},
                {"categories", categories}
            };
        }

        private long incStep(long i, string type)
        {
            switch (type)
            {
                case "year":
                    return (new DateTime(i).AddYears(1)).Ticks;
                case "month":
                    return (new DateTime(i).AddMonths(1)).Ticks;
            }
            return (new DateTime(i).AddDays(1)).Ticks;
        }

        private int date2Int(DateTime d)
        {
            var baseTime = Convert.ToDateTime("1970-1-1 8:00:00");
            var ts = d - baseTime;
            return (int) ts.TotalSeconds;
        }

        protected void PieChart(Hashtable data)
        {
            /*
             * EXAMPLE
            data = new Hashtable { 
                {"titleText", "Browser market shares at a specific website, 2014"},
                {"seriesName", "Browser share"},
                {"seriesData", new ArrayList{
                    new ArrayList{"Firefox", 45.0},
                    new ArrayList{"IE", 26.8},
                    new Hashtable{
                        {"name", "Chrome"},
                        {"y", 12.8},
                        {"sliced", true},
                        {"selected", true}
                    },
                    new ArrayList{"Safari", 8.5},
                    new ArrayList{"Opera", 6.2},
                    new ArrayList{"Others", 0.7}
                }}
            };
            */

            _data = new Hashtable
            {
                {
                    "chart", new Hashtable
                    {
                        {"plotBackgroundColor", null},
                        {"plotBorderWidth", null},
                        {"plotShadow", false}
                    }
                },
                {
                    "title", new Hashtable
                    {
                        {"text", data["titleText"]}
                    }
                },
                {
                    "subtitle", new Hashtable
                    {
                        {"text", data["subtitleText"]},
                        {"x", -20}
                    }
                },
                {
                    "tooltip", new Hashtable
                    {
                        {"pointFormat", "{series.name}: {point.percentage:.1f}%"}
                    }
                },
                {
                    "plotOptions", new Hashtable
                    {
                        {
                            "pie", new Hashtable
                            {
                                {"allowPointSelect", true},
                                {"cursor", "pointer"},
                                {
                                    "dataLabels", new Hashtable
                                    {
                                        {"enabled", true},
                                        {"format", "{point.name} ({point.percentage:.1f} %)"},
                                        {
                                            "style", new Hashtable
                                            {
                                                {
                                                    "color",
                                                    "(Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "series", new ArrayList
                    {
                        new Hashtable
                        {
                            {"type", "pie"},
                            {"name", data["seriesName"]},
                            {"data", data["seriesData"]}
                        }
                    }
                }
            };
        }
        protected void ColumnChart(Hashtable data)
        {
            /*
             * EXAMPLE
            data = new Hashtable { 
                {"titleText", "Browser market shares at a specific website, 2014"},
                {"seriesName", "Browser share"},
                {"seriesData", new ArrayList{
                    new ArrayList{"Firefox", 45.0},
                    new ArrayList{"IE", 26.8},
                    new Hashtable{
                        {"name", "Chrome"},
                        {"y", 12.8},
                        {"sliced", true},
                        {"selected", true}
                    },
                    new ArrayList{"Safari", 8.5},
                    new ArrayList{"Opera", 6.2},
                    new ArrayList{"Others", 0.7}
                }}
            };
            */

            _data = new Hashtable
            {
                {
                    "chart", new Hashtable
                    {
                        {"plotBackgroundColor", null},
                        {"plotBorderWidth", null},
                        {"plotShadow", false},
                        {"type", "column"},
                        {"columns", ((List<Hashtable>)data["seriesData"]).Count}
                    }
                },
                {
                    "xAxis", new Hashtable
                    {
                        {"type", "category"}
                    }
                },
                {
                    "title", new Hashtable
                    {
                        {"text", data["titleText"]}
                    }
                },
                {
                    "subtitle", new Hashtable
                    {
                        {"text", data["subtitleText"]},
                        {"x", -20}
                    }
                },
                {
                    "tooltip", new Hashtable
                    {
                        {"pointFormat", "{series.name}: {point.y}"}
                    }
                },
                {
                    "plotOptions", new Hashtable
                    {
                        {
                            "series", new Hashtable
                            {
                                {"borderWidth", 0},
                                {"cursor", "pointer"},
                                {
                                    "dataLabels", new Hashtable
                                    {
                                        {"enabled", true},
                                        {"format", "{point.y}"},
                                        {
                                            "style", new Hashtable
                                            {
                                                {
                                                    "color",
                                                    "(Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "series", new ArrayList
                    {
                        new Hashtable
                        {
                            {"type", "column"},
                            {"name", data["seriesName"]},
                            {"data", data["seriesData"]}
                        }
                    }
                }
            };
        }
        protected void ColumnGChart(Hashtable data)
        {
            /*
             * EXAMPLE
            data = new Hashtable { 
                {"titleText", "Monthly Average Temperature"},
                {"subtitleText", "Source: WorldClimate.com"},
                {"xAxisCategories", new ArrayList{ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" }},
                {"yAxisTitleText", "Temperature (°C)"},
                {"tooltipValueSuffix", "°C"},
                {"series", new ArrayList{ 
                    new Hashtable{ 
                        {"name", "Tokyo"},
                        {"data", new ArrayList{7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6}}
                    }, 
                    new Hashtable{
                        {"name", "New York"},
                        {"data", new ArrayList{-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5}}
                    }, 
                    new Hashtable{
                        {"name", "Berlin"},
                        {"data", new ArrayList{-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0}}
                    }, 
                    new Hashtable{
                        {"name", "London"},
                        {"data", new ArrayList{3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8}}
                    }
                }}
            };
            */
            _data = new Hashtable
            {
                {
                    "chart", new Hashtable
                    {
                        {"type", "column"},
                        {"columns", ((List<string>)data["xAxisCategories"]).Count}
                    }
                },
                {
                    "title", new Hashtable
                    {
                        {"text", data["titleText"]},
                        {"x", -20} //center
                    }
                },
                {
                    "subtitle", new Hashtable
                    {
                        {"text", data["subtitleText"]},
                        {"x", -20}
                    }
                },
                {
                    "xAxis", new Hashtable
                    {
                        {"categories", data["xAxisCategories"]},
                        {"crosshair", true}
                    }
                },
                {
                    "yAxis", new Hashtable
                    {
                        {
                            "min", 0
                        },
                        {
                            "title", new Hashtable
                            {
                                {"text", data["yAxisTitleText"]}
                            }
                        }
                    }
                },
                {
                    "tooltip", new Hashtable
                    {
                        {"valueSuffix", data["tooltipValueSuffix"]}
                    }
                },
                {
                    "plotOptions", new {
                        column = new {
                            pointPadding = 0.2,
                            borderWidth = 0
                        }
                    }
                },
                {
                    "legend", new Hashtable
                    {
                        {"layout", "vertical"},
                        {"align", "right"},
                        {"verticalAlign", "middle"},
                        {"borderWidth", 0}
                    }
                },
                {"series", data["series"]}
            };
        }
        protected void LineChart(Hashtable data)
        {
            /*
             * EXAMPLE
            data = new Hashtable { 
                {"titleText", "Monthly Average Temperature"},
                {"subtitleText", "Source: WorldClimate.com"},
                {"xAxisCategories", new ArrayList{ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" }},
                {"yAxisTitleText", "Temperature (°C)"},
                {"tooltipValueSuffix", "°C"},
                {"series", new ArrayList{ 
                    new Hashtable{ 
                        {"name", "Tokyo"},
                        {"data", new ArrayList{7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6}}
                    }, 
                    new Hashtable{
                        {"name", "New York"},
                        {"data", new ArrayList{-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5}}
                    }, 
                    new Hashtable{
                        {"name", "Berlin"},
                        {"data", new ArrayList{-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0}}
                    }, 
                    new Hashtable{
                        {"name", "London"},
                        {"data", new ArrayList{3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8}}
                    }
                }}
            };
            */
            _data = new Hashtable
            {
                {
                    "chart", new Hashtable
                    {
                        {"type", "spline"}
                    }
                },
                {
                    "title", new Hashtable
                    {
                        {"text", data["titleText"]},
                        {"x", -20} //center
                    }
                },
                {
                    "subtitle", new Hashtable
                    {
                        {"text", data["subtitleText"]},
                        {"x", -20}
                    }
                },
                {
                    "xAxis", new Hashtable
                    {
                        {"categories", data["xAxisCategories"]}
                    }
                },
                {
                    "yAxis", new Hashtable
                    {
                        {
                            "title", new Hashtable
                            {
                                {"text", data["yAxisTitleText"]}
                            }
                        },
                        {
                            "plotLines", new ArrayList
                            {
                                new Hashtable
                                {
                                    {"value", 0},
                                    {"width", 1},
                                    {"color", "#808080"}
                                }
                            }
                        }
                    }
                },
                {
                    "tooltip", new Hashtable
                    {
                        {"valueSuffix", data["tooltipValueSuffix"]}
                    }
                },
                {
                    "legend", new Hashtable
                    {
                        {"layout", "vertical"},
                        {"align", "right"},
                        {"verticalAlign", "middle"},
                        {"borderWidth", 0}
                    }
                },
                {"series", data["series"]}
            };
        }
    }
}