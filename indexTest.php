<?php
// backward compatibility
if (!class_exists('\PHPUnit\Framework\TestCase') &&
    class_exists('\PHPUnit_Framework_TestCase')) {
    class_alias('\PHPUnit_Framework_TestCase', '\PHPUnit\Framework\TestCase');
}

use PHPUnit\Framework\TestCase;

class indexTest extends TestCase
{
    public function testEcho()
    {
        $this->assertEquals(0, 0);
    }
}
