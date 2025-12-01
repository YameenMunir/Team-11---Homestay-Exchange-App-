// ============================================================================
// TEST AUTH STATUS - Run this in Browser Console
// ============================================================================
// Copy and paste this entire code into your browser console (F12)
// to check if you're properly authenticated as admin
// ============================================================================

(async function testAuthStatus() {
  console.log('=================================');
  console.log('AUTHENTICATION STATUS CHECK');
  console.log('=================================\n');

  // Test 1: Check if user is logged in
  console.log('TEST 1: Current User Session');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('❌ Session Error:', sessionError);
    return;
  }

  if (!session) {
    console.error('❌ NOT LOGGED IN');
    console.log('\nSOLUTION: You need to log in first!');
    console.log('Go to your login page and log in with:');
    console.log('  Email: admin@admin.com');
    console.log('  Password: password123');
    return;
  }

  console.log('✓ User is logged in');
  console.log('  Email:', session.user.email);
  console.log('  User ID:', session.user.id);
  console.log('');

  // Test 2: Check user profile
  console.log('TEST 2: User Profile Data');
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('❌ Error fetching profile:', profileError);
    console.log('\nThis might be an RLS issue or the profile doesn\'t exist.');
    return;
  }

  console.log('✓ Profile found');
  console.log('  Full Name:', profile.full_name);
  console.log('  Role:', profile.role);
  console.log('  Is Verified:', profile.is_verified);
  console.log('  Is Active:', profile.is_active);
  console.log('');

  // Test 3: Check if admin
  if (profile.role !== 'admin') {
    console.error('❌ NOT AN ADMIN USER');
    console.log('  Current role:', profile.role);
    console.log('\nSOLUTION: Log in with admin account:');
    console.log('  Email: admin@admin.com');
    console.log('  Password: password123');
    return;
  }

  console.log('✓ User has admin role');
  console.log('');

  // Test 4: Test fetching all users
  console.log('TEST 3: Fetch All Users (RLS Test)');
  const { data: users, error: usersError } = await supabase
    .from('user_profiles')
    .select('id, email, role, full_name, is_verified')
    .order('created_at', { ascending: false });

  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
    console.log('\nThis is the RLS BLOCKING issue!');
    console.log('Error details:', usersError);
    return;
  }

  console.log('✓ Successfully fetched users');
  console.log('  Total users:', users.length);
  console.log('  Users:', users);
  console.log('');

  // Test 5: Test the is_admin() function
  console.log('TEST 4: Test is_admin() Function');
  const { data: adminCheck, error: adminError } = await supabase
    .rpc('is_admin');

  if (adminError) {
    console.error('❌ Error checking admin status:', adminError);
  } else {
    console.log('✓ is_admin() returned:', adminCheck);
  }

  console.log('');
  console.log('=================================');
  console.log('SUMMARY');
  console.log('=================================');

  if (users && users.length > 0 && profile.role === 'admin') {
    console.log('✅ ALL TESTS PASSED!');
    console.log('You are properly authenticated as admin.');
    console.log('The User Management panel should work now.');
    console.log('\nIf it\'s still not working, try:');
    console.log('1. Hard refresh the page (Ctrl+Shift+R)');
    console.log('2. Clear browser cache');
    console.log('3. Check the specific error in adminService.js');
  } else {
    console.log('❌ TESTS FAILED');
    console.log('User Management will not work until issues are resolved.');
  }
})();
