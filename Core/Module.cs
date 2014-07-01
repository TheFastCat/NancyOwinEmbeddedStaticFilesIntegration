namespace Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Nancy;

    public class Module : NancyModule
    {
        public Module()
        {
            Get["/home"] = _ =>
            {
                return Negotiate.WithView("index");
            };
            Get["/diagnostics"] = _ =>
            {
                return Negotiate.WithView("diagnostics");
            };
        }
    }
}