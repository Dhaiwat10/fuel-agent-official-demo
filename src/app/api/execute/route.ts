export async function POST(req: Request) {
  const { command } = await req.json();
  return Response.json({
    status: 'success',
    message: 'Command executed successfully',
    command,
  });
}
