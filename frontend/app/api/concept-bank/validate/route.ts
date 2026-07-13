import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/concept-bank/validate
 * Validates a template stem template against variables array
 */
export async function POST(request: NextRequest) {
  try {
    const { stem_template, variables } = await request.json();

    if (!stem_template) {
      return NextResponse.json({ success: false, error: 'stem_template is required' }, { status: 400 });
    }

    // Extract placeholders: e.g. "Find {v} given {u}" => ['v', 'u']
    const matches = stem_template.match(/\{([^}]+)\}/g) || [];
    const placeholders = matches.map((m: string) => m.slice(1, -1));

    const varSymbols = new Set((variables || []).map((v: any) => v.symbol));

    const missingVariables: string[] = [];
    for (const placeholder of placeholders) {
      // Ignore some common placeholders that might not be variables (e.g. {object}, {unknown})
      if (placeholder !== 'unknown' && placeholder !== 'object' && placeholder !== 'known_variables' && !varSymbols.has(placeholder)) {
        missingVariables.push(placeholder);
      }
    }

    if (missingVariables.length > 0) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `The following placeholders in the question stem are not defined in the variables array: ${missingVariables.join(', ')}`,
        missing: missingVariables
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      message: 'Template is structurally valid!'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
