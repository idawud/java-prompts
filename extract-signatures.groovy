// ─────────────────────────────────────────────────────────────────────────────
// extract-signatures.groovy
// IntelliJ Groovy Scratch File — PSI-based method signature extractor
//
// HOW TO USE:
//   1. Open this file as a scratch file in IntelliJ (File > New Scratch File > Groovy)
//   2. Set TARGET_CLASSES to the fully-qualified names of the classes you want.
//   3. Run with "Run using IDE" (the green play button at the top of the scratch).
//   4. The formatted signatures are printed to the console AND copied to clipboard.
//   5. Paste into the {{PASTED_SIGNATURES}} slot of your chosen .prompt template.
//
// REQUIREMENTS: Run inside IntelliJ (requires the IDE's PSI and project APIs).
// ─────────────────────────────────────────────────────────────────────────────

import com.intellij.openapi.project.ProjectManager
import com.intellij.psi.*
import com.intellij.psi.search.GlobalSearchScope
import java.awt.Toolkit
import java.awt.datatransfer.StringSelection

// ── CONFIGURE HERE ────────────────────────────────────────────────────────────
def TARGET_CLASSES = [
    // Add fully-qualified class names here, e.g.:
    "com.example.pricing.PricingEngine",
    "com.example.order.OrderService",
]

// Set to true to include private methods, false for public/protected only
def INCLUDE_PRIVATE = false

// Set to true to include field declarations as well as methods
def INCLUDE_FIELDS = true
// ─────────────────────────────────────────────────────────────────────────────

def project = ProjectManager.instance.openProjects.first()
def facade  = JavaPsiFacade.getInstance(project)
def scope   = GlobalSearchScope.allScope(project)
def output  = new StringBuilder()

TARGET_CLASSES.each { fqn ->
    def psiClass = facade.findClass(fqn, scope)
    if (psiClass == null) {
        output.append("// WARNING: class not found on classpath: ${fqn}\n\n")
        return
    }

    output.append("// ── ${fqn} ─────────────────────────────────\n")

    // Fields
    if (INCLUDE_FIELDS) {
        psiClass.fields.each { field ->
            def vis = visibilityText(field)
            if (!INCLUDE_PRIVATE && vis == "private") return
            def mods = modifiersText(field)
            output.append("${mods}${field.type.canonicalText} ${field.name};\n")
        }
        if (psiClass.fields.length > 0) output.append("\n")
    }

    // Constructors
    psiClass.constructors.each { ctor ->
        def vis = visibilityText(ctor)
        if (!INCLUDE_PRIVATE && vis == "private") return
        def params = paramsText(ctor)
        def throws_ = throwsText(ctor)
        output.append("${vis}${psiClass.name}(${params})${throws_};\n")
    }
    if (psiClass.constructors.length > 0) output.append("\n")

    // Methods
    psiClass.methods.each { method ->
        def vis = visibilityText(method)
        if (!INCLUDE_PRIVATE && vis == "private") return
        def mods   = modifiersText(method)
        def ret    = method.returnType?.canonicalText ?: "void"
        def params = paramsText(method)
        def throws_ = throwsText(method)
        output.append("${mods}${ret} ${method.name}(${params})${throws_};\n")
    }
    output.append("\n")
}

// ── Helpers ───────────────────────────────────────────────────────────────────

def visibilityText(PsiModifierListOwner member) {
    def ml = member.modifierList
    if (ml == null) return ""
    if (ml.hasModifierProperty(PsiModifier.PUBLIC))    return "public "
    if (ml.hasModifierProperty(PsiModifier.PROTECTED)) return "protected "
    if (ml.hasModifierProperty(PsiModifier.PRIVATE))   return "private "
    return ""   // package-private
}

def modifiersText(PsiModifierListOwner member) {
    def parts = []
    def ml = member.modifierList
    if (ml == null) return ""
    if (ml.hasModifierProperty(PsiModifier.PUBLIC))    parts << "public"
    if (ml.hasModifierProperty(PsiModifier.PROTECTED)) parts << "protected"
    if (ml.hasModifierProperty(PsiModifier.PRIVATE))   parts << "private"
    if (ml.hasModifierProperty(PsiModifier.STATIC))    parts << "static"
    if (ml.hasModifierProperty(PsiModifier.FINAL))     parts << "final"
    if (ml.hasModifierProperty(PsiModifier.ABSTRACT))  parts << "abstract"
    if (ml.hasModifierProperty(PsiModifier.SYNCHRONIZED)) parts << "synchronized"
    parts.isEmpty() ? "" : parts.join(" ") + " "
}

def paramsText(PsiMethod method) {
    method.parameterList.parameters.collect { p ->
        "${p.type.canonicalText} ${p.name}"
    }.join(", ")
}

def throwsText(PsiMethod method) {
    def refs = method.throwsList.referencedTypes
    refs.length == 0 ? "" : " throws " + refs.collect { it.canonicalText }.join(", ")
}

// ── Output ────────────────────────────────────────────────────────────────────
def result = output.toString()
println result

// Copy to clipboard
def sel = new StringSelection(result)
Toolkit.defaultToolkit.systemClipboard.setContents(sel, sel)
println "// ✓ Copied to clipboard — paste into {{PASTED_SIGNATURES}}"
