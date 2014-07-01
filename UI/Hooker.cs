using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UI
{
    /// Warning: theoretical Deep magic/heavy wizardry ahead...
    /// <summary>
    /// This is a funny little class whose purpose is not immediately clear. The assembly in which it resides, UI, contains
    /// no classes (save for this one) -- it exists to harbor .html, .cshtml, .sshtml views as embedded resources. These views are consumed
    /// by Core.csproj and served as static files via HTTP to respond to requests. This is all great, unfortunately it makes
    /// dynamically consuming the UI assembly at runtime a little tricky since without a declared type within its assembly namespace
    /// (since it only harbors static files as resources), the following Assembly-fetching call is impossible:
    /// 
    ///     return typeof(????).Assembly;// to return the UI assembly from within the Core or Test runtimes
    ///     
    ///     The alternatives to this call (above) involve dynamically searching directories associated with the current AppDomain in order to find
    /// and load the UI assembly. I went down this path (see the methods within Info.IApplicationInfo.cs associated 
    /// with this commit) ; and it's possible to get to work however the added complexity in accounting for the application execution context (Testing,
    /// Website, CloudService etc) and the file structure, assembly locations therein, made for heavy wizardry (http://goo.gl/0zGGWE) and overly-complex
    /// code; therefore a solution more in line with Occam's razor is preferable. This solution (for me) was to simply create a class definition within
    /// the UI assembly that consumers of views can "hook into" easily via:
    /// 
    ///     return typeof(????).Assembly;// to return an instance of the UI assembly at runtime
    ///     
    /// It's clean and simple though it requires Core.csproj to explicitly reference UI.csproj. There might be a possible
    /// solution to implement dynamic assembly loading of the UI assembly from Nancy using the aforementioned tactics that would add the
    /// benefit of complete Nancy agnosticism - however for now the added complexity and development effort wouldn't equate to any advantage.
    /// </summary>
    public sealed class Hooker
    {
        // the best part about the name is that it's perfect
    }
}
